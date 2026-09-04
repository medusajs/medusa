import { Logger } from "@medusajs/framework/types"
import { RedisCacheModuleOptions } from "@types"
import { Redis } from "ioredis"
import { createGunzip, createGzip } from "zlib"

/**
 * How many members of a forward tag set one pass of a tag-based `clear` may
 * hold at a time. Everything the tag path allocates is a function of this
 * number rather than of how large the tag set has grown, so a set that has
 * accumulated hundreds of thousands of members costs more round trips but not
 * more memory.
 */
const CLEAR_CHUNK_SIZE = 500

export class RedisCachingProvider {
  static identifier = "cache-redis"

  protected redisClient: Redis
  protected keyNamePrefix: string
  protected defaultTTL: number
  protected compressionThreshold: number
  protected hasher: (key: string) => string
  protected logger: Logger

  constructor(
    {
      redisClient,
      logger,
      prefix,
      hasher,
    }: {
      redisClient: Redis
      prefix: string
      hasher: (key: string) => string
      logger: Logger
    },
    options?: RedisCacheModuleOptions
  ) {
    this.redisClient = redisClient
    this.keyNamePrefix = prefix
    this.defaultTTL = options?.ttl ?? 3600 // 1 hour default
    this.compressionThreshold = options?.compressionThreshold ?? 2048 // 2KB default
    this.hasher = hasher
    this.logger = logger
  }

  private isConnectionError(error: any): boolean {
    return (
      error.code === "ECONNREFUSED" ||
      error.code === "ENOTFOUND" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ECONNRESET" ||
      error.code === "EPIPE" ||
      error.message?.includes("Connection is closed") ||
      error.message?.includes("connect ECONNREFUSED") ||
      error.message?.includes("connect ETIMEDOUT") ||
      error.message?.includes("Command timed out") ||
      error.message?.includes("Maximum number of retries exceeded") ||
      ["connecting", "reconnecting", "disconnecting", "wait", "end"].includes(
        this.redisClient.status
      )
    )
  }

  private isConnectionHealthy(): boolean {
    return this.redisClient.status === "ready"
  }

  #getKeyName(key: string): string {
    return `${this.keyNamePrefix}${key}`
  }

  /**
   * Forward index: tag -> set of cache entry keys
   */
  #getTagKey(
    tag: string,
    { isHashed = false }: { isHashed?: boolean } = {}
  ): string {
    return `${this.keyNamePrefix}tag:${isHashed ? tag : this.hasher(tag)}`
  }

  /**
   * Reverse index: cache entry key -> set of hashed tags
   */
  #getTagsKey(key: string): string {
    return `${this.keyNamePrefix}tags:${key}`
  }

  #getLogicalKey(keyName: string): string {
    return keyName.replace(this.keyNamePrefix, "")
  }

  /**
   * Remove keys from forward tag sets and drop their reverse indexes.
   * Prefer running this before deleting entries so a failed/interrupted clear
   * cannot leave entries that still exist but are unreachable for tag invalidation.
   */
  async #removeTagIndexes(keyNames: string[]): Promise<void> {
    if (!keyNames.length) {
      return
    }

    const tagsKeys = keyNames.map((keyName) =>
      this.#getTagsKey(this.#getLogicalKey(keyName))
    )

    const readPipeline = this.redisClient.pipeline()
    tagsKeys.forEach((tagsKey) => {
      readPipeline.smembers(tagsKey)
    })
    const tagResults = await readPipeline.exec()

    const cleanupPipeline = this.redisClient.pipeline()
    keyNames.forEach((keyName, index) => {
      const hashedTags = (tagResults?.[index]?.[1] as string[]) ?? []
      hashedTags.forEach((hashedTag) => {
        cleanupPipeline.srem(
          this.#getTagKey(hashedTag, { isHashed: true }),
          keyName
        )
      })
      cleanupPipeline.unlink(tagsKeys[index])
    })
    await cleanupPipeline.exec()
  }

  /**
   * Drop tag indexes first, then delete entry hashes.
   */
  async #deleteEntries(keyNames: string[]): Promise<void> {
    if (!keyNames.length) {
      return
    }

    await this.#removeTagIndexes(keyNames)

    const deletePipeline = this.redisClient.pipeline()
    keyNames.forEach((keyName) => {
      deletePipeline.unlink(keyName)
    })
    await deletePipeline.exec()
  }

  /**
   * Walks one forward tag set and clears the entries it points at.
   *
   * The set is consumed with SSCAN in bounded chunks rather than read whole with
   * SMEMBERS: a tag such as `Product:list:*` is attached to every cached list
   * entry, so its set grows with storefront traffic and a single-step read makes
   * peak memory and pipeline size a function of that growth.
   *
   * The scan also prunes. An entry that expires by TTL is dropped by Redis but
   * stays a member of every tag set it was indexed under, because membership is
   * only removed here and only for entries whose reverse index is still alive --
   * and that index outlives the entry by just 60s. The forward set's own TTL is
   * refreshed by every later write carrying the tag, so on a busy tag it never
   * expires either. Left alone the set therefore grows monotonically and each
   * clear gets more expensive than the last. Removing the members whose entry is
   * already gone, while we are holding them anyway, stops that ratchet.
   */
  async #clearTag(tag: string, autoInvalidateOnly: boolean): Promise<void> {
    const tagKey = this.#getTagKey(tag)

    let cursor = "0"

    do {
      const [nextCursor, members] = await this.redisClient.sscan(
        tagKey,
        cursor,
        "COUNT",
        CLEAR_CHUNK_SIZE
      )
      cursor = nextCursor

      if (!members?.length) {
        continue
      }

      // SSCAN may return the same member at more than one cursor position.
      const keyNames = Array.from(new Set(members))

      const probePipeline = this.redisClient.pipeline()
      keyNames.forEach((keyName) => {
        probePipeline.exists(keyName)
        probePipeline.hget(keyName, "options")
      })
      const probeResults = await probePipeline.exec()

      const staleKeyNames: string[] = []
      const keysToDelete: string[] = []

      keyNames.forEach((keyName, index) => {
        if (!probeResults?.[index * 2]?.[1]) {
          // The entry is gone; only its membership is left behind.
          staleKeyNames.push(keyName)
          return
        }

        if (!autoInvalidateOnly) {
          // Explicit call, clear everything the tag points at.
          keysToDelete.push(keyName)
          return
        }

        const storedOptions = probeResults?.[index * 2 + 1]?.[1] as
          | string
          | null

        if (!storedOptions) {
          // No options stored, default to true
          keysToDelete.push(keyName)
          return
        }

        try {
          // Delete if entry has autoInvalidate=true or no setting (default true)
          if (JSON.parse(storedOptions).autoInvalidate ?? true) {
            keysToDelete.push(keyName)
          }
        } catch (e) {
          // If can't parse options, assume it's safe to delete (default true)
          keysToDelete.push(keyName)
        }
      })

      await this.#deleteEntries(keysToDelete)
      // Stale members may still have a reverse index, which names every other
      // tag set holding them. Reuse it while it is there.
      await this.#removeTagIndexes(staleKeyNames)

      // Backstop for the set being scanned: the two calls above drop a member
      // only when its reverse index resolved, and for an expired entry it
      // usually has not. Without this the member survives the clear and the set
      // never shrinks.
      const prunedKeyNames = keysToDelete.concat(staleKeyNames)
      if (prunedKeyNames.length) {
        await this.redisClient.srem(tagKey, ...prunedKeyNames)
      }
    } while (cursor !== "0")
  }

  async #compressData(data: string): Promise<Buffer> {
    if (data.length <= this.compressionThreshold) {
      const buffer = Buffer.from(data, "utf8")
      const prefix = Buffer.from([0]) // 0 = uncompressed
      return Buffer.concat([prefix, buffer])
    }

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      const gzip = createGzip()

      gzip.on("data", (chunk) => chunks.push(chunk))
      gzip.on("end", () => {
        const compressedBuffer = Buffer.concat(chunks)
        const prefix = Buffer.from([1]) // 1 = compressed
        resolve(Buffer.concat([prefix, compressedBuffer]))
      })
      gzip.on("error", (error) => {
        const buffer = Buffer.from(data, "utf8")
        const prefix = Buffer.from([0])
        resolve(Buffer.concat([prefix, buffer]))
      })

      gzip.write(data, "utf8")
      gzip.end()
    })
  }

  async #decompressData(buffer: Buffer): Promise<string> {
    if (buffer.length === 0) {
      return ""
    }

    const formatByte = buffer[0]
    const dataBuffer = buffer.subarray(1)

    if (formatByte === 0) {
      // Uncompressed
      return dataBuffer.toString("utf8")
    }

    if (formatByte === 1) {
      // Compressed with gzip
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = []
        const gunzip = createGunzip()

        gunzip.on("data", (chunk) => chunks.push(chunk))
        gunzip.on("end", () => {
          const decompressed = Buffer.concat(chunks).toString("utf8")
          resolve(decompressed)
        })
        gunzip.on("error", (error) => {
          // Fallback: return as-is if decompression fails
          resolve(dataBuffer.toString("utf8"))
        })

        gunzip.write(dataBuffer)
        gunzip.end()
      })
    }

    // Unknown format, return as UTF-8
    return buffer.toString("utf8")
  }

  async get({ key, tags }: { key?: string; tags?: string[] }): Promise<any> {
    if (!this.isConnectionHealthy()) {
      return null
    }

    if (key) {
      try {
        const keyName = this.#getKeyName(key)
        const buffer = await this.redisClient.hgetBuffer(keyName, "data")
        if (!buffer) {
          return null
        }

        const finalData = await this.#decompressData(buffer)
        return JSON.parse(finalData)
      } catch (error) {
        if (this.isConnectionError(error)) {
          this.logger.warn(
            `[redis-cache] Redis connection error during get operation, returning empty array to trigger fallback to original data source. Error: ${
              error?.message ?? error
            }`
          )
          return null
        }
        throw error
      }
    }

    if (tags?.length) {
      try {
        // Get all keys associated with the tags
        const pipeline = this.redisClient.pipeline()
        tags.forEach((tag) => {
          const tagKey = this.#getTagKey(tag)
          pipeline.smembers(tagKey)
        })

        const tagResults = await pipeline.exec()
        const allKeys = new Set<string>()

        tagResults?.forEach((result, index) => {
          if (result && result[1]) {
            ;(result[1] as string[]).forEach((key) => allKeys.add(key))
          }
        })

        if (allKeys.size === 0) {
          return []
        }

        // Get all hash data for the keys
        const valuePipeline = this.redisClient.pipeline()
        Array.from(allKeys).forEach((key) => {
          valuePipeline.hgetBuffer(key, "data")
        })

        const valueResults = await valuePipeline.exec()
        const results: any[] = []

        const decompressionPromises = (valueResults || []).map(
          async (result) => {
            if (result && result[1]) {
              const buffer = result[1] as Buffer
              try {
                const finalData = await this.#decompressData(buffer)
                return JSON.parse(finalData)
              } catch (e) {
                // If JSON parsing fails, skip this entry (corrupted data)
                this.logger.warn(
                  `[redis-cache] Skipping corrupted cache entry: ${e.message}`
                )
                return null
              }
            }
            return null
          }
        )

        const decompressionResults = await Promise.all(decompressionPromises)
        results.push(...decompressionResults.filter(Boolean))

        return results
      } catch (error) {
        if (this.isConnectionError(error)) {
          this.logger.warn(
            `[redis-cache] Redis connection error during get operation, returning empty array to trigger fallback to original data source. Error: ${
              error?.message ?? error
            }`
          )
          return null
        }
        throw error
      }
    }

    return null
  }

  async set({
    key,
    data,
    ttl,
    tags,
    options,
  }: {
    key: string
    data: object
    ttl?: number
    tags?: string[]
    options?: {
      autoInvalidate?: boolean
    }
  }): Promise<void> {
    try {
      const keyName = this.#getKeyName(key)
      const serializedData = JSON.stringify(data)
      const effectiveTTL = ttl ?? this.defaultTTL

      const finalData = await this.#compressData(serializedData)
      const hashedTags = tags?.map((tag) => this.hasher(tag)) ?? []

      const setPipeline = this.redisClient.pipeline()

      // Main data with conditional operations
      setPipeline.hset(keyName, "data", finalData)
      if (options && Object.keys(options).length) {
        setPipeline.hset(keyName, "options", JSON.stringify(options))
      }
      if (effectiveTTL) {
        setPipeline.expire(keyName, effectiveTTL)
      }

      // Bidirectional tag indexes (tag -> keys, key -> tags)
      if (hashedTags.length) {
        const tagsKey = this.#getTagsKey(key)

        setPipeline.sadd(tagsKey, ...hashedTags)
        if (effectiveTTL) {
          setPipeline.expire(tagsKey, effectiveTTL + 60)
        }

        hashedTags.forEach((hashedTag) => {
          const tagKey = this.#getTagKey(hashedTag, { isHashed: true })
          setPipeline.sadd(tagKey, keyName)
          if (effectiveTTL) {
            setPipeline.expire(tagKey, effectiveTTL + 60)
          }
        })
      }

      await setPipeline.exec()
    } catch (error) {
      if (this.isConnectionError(error)) {
        this.logger.warn(
          `[redis-cache] Redis connection error during set operation, relying on IORedis retry mechanism. Error: ${
            error?.message ?? error
          }`
        )
        return
      }
      throw error
    }
  }

  async clear({
    key,
    tags,
    options,
  }: {
    key?: string
    tags?: string[]
    options?: {
      autoInvalidate?: boolean
    }
  }): Promise<void> {
    try {
      if (key) {
        await this.#deleteEntries([this.#getKeyName(key)])
        return
      }

      if (!tags?.length) {
        return
      }

      // Handle wildcard tag to clear all cache data
      if (tags.includes("*")) {
        await this.flush()
        return
      }

      // A strategy-driven invalidation passes `{ autoInvalidate: true }` and has
      // to leave entries that opted out alone; an explicit call passes no
      // options and clears everything. Any other options object is not an
      // invalidation request and clears nothing, as before.
      if (options && options.autoInvalidate !== true) {
        return
      }

      const autoInvalidateOnly = !!options

      // Sequential on purpose: the tags of one invalidation overlap heavily, and
      // walking them one at a time keeps the work in flight bounded by the chunk
      // size no matter how many tags a single clear was handed.
      for (const tag of tags) {
        await this.#clearTag(tag, autoInvalidateOnly)
      }
    } catch (error) {
      if (this.isConnectionError(error)) {
        this.logger.warn(
          `[redis-cache] Redis connection error during clear operation, relying on IORedis retry mechanism. Error: ${
            error?.message ?? error
          }`
        )
        return
      }
      throw error
    }
  }

  async flush(): Promise<void> {
    try {
      // Use SCAN to find ALL keys with our prefix and delete them
      // This includes main cache keys, tag keys (tag:*), and tags keys (tags:*)
      const pattern = `${this.keyNamePrefix}*`
      let cursor = "0"

      do {
        const result = await this.redisClient.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          1000
        )
        cursor = result[0]
        const keys = result[1]

        if (keys.length) {
          await this.redisClient.unlink(...keys)
        }
      } while (cursor !== "0")
    } catch (error) {
      if (this.isConnectionError(error)) {
        this.logger.warn(
          `[redis-cache] Redis connection error during flush operation, relying on IORedis retry mechanism. Error: ${
            error?.message ?? error
          }`
        )
        return
      }
      throw error
    }
  }
}
