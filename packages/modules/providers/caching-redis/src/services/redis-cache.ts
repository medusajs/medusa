import { Logger } from "@medusajs/framework/types"
import { RedisCacheModuleOptions } from "@types"
import { ChainableCommander, ClientContext, Redis, Result } from "ioredis"
import { createGunzip, createGzip } from "zlib"

const CLEAR_BATCH_SIZE = 1000

/**
 * KEYS[1] is a tag set, KEYS[2..n] are members read from it. Removes the
 * members whose entry no longer exists (expired by TTL) and returns the live ones.
 * Runs as a script so a concurrent `set()` cannot recreate an entry between the
 * existence check and the SREM, which would leave a live entry unindexed.
 */
const PRUNE_EXPIRED_TAG_MEMBERS_SCRIPT = `
local live = {}
for i = 2, #KEYS do
  if redis.call('EXISTS', KEYS[i]) == 1 then
    live[#live + 1] = KEYS[i]
  else
    redis.call('SREM', KEYS[1], KEYS[i])
  end
end
return live
`

/**
 * KEYS are tag sets, ARGV[1] the entry key to index, ARGV[2] the expiry the
 * sets need for this entry in seconds (0 = the entry never expires).
 * A tag set is shared by entries with different TTLs and must outlive all of
 * them, so its expiry is only ever extended: a plain EXPIRE would let a
 * short-lived entry expire the set while longer-lived entries still rely on it
 * for tag invalidation.
 */
const INDEX_ENTRY_IN_TAG_SETS_SCRIPT = `
local ttl = tonumber(ARGV[2])
for i = 1, #KEYS do
  local existed = redis.call('EXISTS', KEYS[i]) == 1
  redis.call('SADD', KEYS[i], ARGV[1])
  if ttl == 0 then
    redis.call('PERSIST', KEYS[i])
  else
    local current = redis.call('TTL', KEYS[i])
    if not existed or (current >= 0 and current < ttl) then
      redis.call('EXPIRE', KEYS[i], ttl)
    end
  end
end
`

/**
 * Lua scripts registered on the client with `defineCommand`. `Context` makes a
 * command return a promise on the client and the pipeline on a pipeline.
 * Both scripts take a variable number of keys, so the key count is the first argument.
 */
type CustomCommands<Context extends ClientContext = { type: "default" }> = {
  pruneExpiredTagMembers(
    numberOfKeys: number,
    ...keys: string[]
  ): Result<string[], Context>
  indexEntryInTagSets(
    numberOfKeys: number,
    ...keysAndArgs: (string | number)[]
  ): Result<null, Context>
}

export class RedisCachingProvider {
  static identifier = "cache-redis"

  protected redisClient: Redis & CustomCommands
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
    this.redisClient = redisClient as Redis & CustomCommands
    // Registered once so ioredis runs them through EVALSHA instead of sending
    // the script body on every call
    this.redisClient.defineCommand("pruneExpiredTagMembers", {
      lua: PRUNE_EXPIRED_TAG_MEMBERS_SCRIPT,
    })
    this.redisClient.defineCommand("indexEntryInTagSets", {
      lua: INDEX_ENTRY_IN_TAG_SETS_SCRIPT,
    })
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

      const setPipeline = this.redisClient.pipeline() as ChainableCommander &
        CustomCommands<{ type: "pipeline" }>

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

        const tagKeys = hashedTags.map((hashedTag) =>
          this.#getTagKey(hashedTag, { isHashed: true })
        )
        setPipeline.indexEntryInTagSets(
          tagKeys.length,
          ...tagKeys,
          keyName,
          effectiveTTL ? effectiveTTL + 60 : 0
        )
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

      if (tags?.length) {
        // Handle wildcard tag to clear all cache data
        if (tags.includes("*")) {
          await this.flush()
          return
        }

        if (options && options.autoInvalidate !== true) {
          return
        }

        // Iterate tag members in batches so memory stays bounded for large tags
        for (const tag of tags) {
          const tagKey = this.#getTagKey(tag)
          let cursor = "0"

          do {
            const [nextCursor, keyNames] = await this.redisClient.sscan(
              tagKey,
              cursor,
              "COUNT",
              CLEAR_BATCH_SIZE
            )
            cursor = nextCursor

            const liveKeyNames = await this.#pruneExpiredTagMembers(
              tagKey,
              keyNames
            )
            await this.#clearTaggedEntries(liveKeyNames, options)
          } while (cursor !== "0")
        }
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

  /**
   * Redis expiry deletes an entry but leaves its key in the forward tag sets.
   * Drop those members here, otherwise every clear of the tag walks them again.
   */
  async #pruneExpiredTagMembers(
    tagKey: string,
    keyNames: string[]
  ): Promise<string[]> {
    if (!keyNames.length) {
      return keyNames
    }

    return await this.redisClient.pruneExpiredTagMembers(
      keyNames.length + 1,
      tagKey,
      ...keyNames
    )
  }

  async #clearTaggedEntries(
    keyNames: string[],
    options?: { autoInvalidate?: boolean }
  ): Promise<void> {
    if (!keyNames.length) {
      return
    }

    // If no options provided (user explicit call), clear everything
    if (!options) {
      await this.#deleteEntries(keyNames)
      return
    }

    // autoInvalidate is true (strategy call), only clear entries with autoInvalidate=true (default)
    const optionsPipeline = this.redisClient.pipeline()

    keyNames.forEach((key) => {
      optionsPipeline.hget(key, "options")
    })

    const optionsResults = await optionsPipeline.exec()
    const keysToDelete: string[] = []

    keyNames.forEach((key, index) => {
      const optionsResult = optionsResults?.[index]

      if (optionsResult && optionsResult[1]) {
        try {
          const entryOptions = JSON.parse(optionsResult[1] as string)

          // Delete if entry has autoInvalidate=true or no setting (default true)
          const shouldAutoInvalidate = entryOptions.autoInvalidate ?? true

          if (shouldAutoInvalidate) {
            keysToDelete.push(key)
          }
        } catch (e) {
          // If can't parse options, assume it's safe to delete (default true)
          keysToDelete.push(key)
        }
      } else {
        // No options stored, default to true
        keysToDelete.push(key)
      }
    })

    await this.#deleteEntries(keysToDelete)
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
