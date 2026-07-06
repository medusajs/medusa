import { Logger } from "@medusajs/framework/types"
import { RedisCacheModuleOptions } from "@types"
import { Redis } from "ioredis"
import { createGunzip, createGzip } from "zlib"

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

  #getTagKey(
    tag: string,
    { isHashed = false }: { isHashed?: boolean } = {}
  ): string {
    return `${this.keyNamePrefix}tag:${isHashed ? tag : this.hasher(tag)}`
  }

  #getTagsKey(key: string): string {
    return `${this.keyNamePrefix}tags:${key}`
  }

  #getTagDictionaryKey(): string {
    return `${this.keyNamePrefix}tag:dictionary`
  }

  #getTagNextIdKey(): string {
    return `${this.keyNamePrefix}tag:next_id`
  }

  #getTagRefCountKey(): string {
    return `${this.keyNamePrefix}tag:refs`
  }

  #getTagReverseDictionaryKey(): string {
    return `${this.keyNamePrefix}tag:reverse_dict`
  }

  async #internTags(tags: string[]): Promise<number[]> {
    const pipeline = this.redisClient.pipeline()
    const dictionaryKey = this.#getTagDictionaryKey()

    const hashedTags = tags.map((tag) => this.hasher(tag))

    // Get existing tag IDs
    hashedTags.forEach((tag) => {
      pipeline.hget(dictionaryKey, tag)
    })

    const results = await pipeline.exec()
    const tagIds: number[] = []
    const newTags: string[] = []

    for (let i = 0; i < hashedTags.length; i++) {
      const result = results?.[i]
      if (result && result[1]) {
        tagIds[i] = parseInt(result[1] as string)
      } else {
        const hashedTag = hashedTags[i]
        newTags.push(hashedTag)
        tagIds[i] = -1 // Placeholder for new tags
      }
    }

    // Create IDs for new tags
    if (newTags.length) {
      const nextIdKey = this.#getTagNextIdKey()
      const reverseDictKey = this.#getTagReverseDictionaryKey()
      const refCountKey = this.#getTagRefCountKey()
      const startId = await this.redisClient.incrby(nextIdKey, newTags.length)

      const batchPipeline = this.redisClient.pipeline()
      newTags.forEach((tag, index) => {
        const newId = startId - newTags.length + index + 1

        // Store in both forward and reverse dictionaries
        batchPipeline.hset(dictionaryKey, tag, newId.toString())
        batchPipeline.hset(reverseDictKey, newId.toString(), tag)

        // Update the tagIds array
        const originalIndex = hashedTags.indexOf(tag)
        tagIds[originalIndex] = newId
      })

      // Add reference count increments to the same pipeline
      tagIds.forEach((id) => {
        if (id !== -1) {
          batchPipeline.hincrby(refCountKey, id.toString(), 1)
        }
      })

      await batchPipeline.exec()
    } else {
      // Only increment reference count for existing tags
      const refCountKey = this.#getTagRefCountKey()
      const refPipeline = this.redisClient.pipeline()
      tagIds.forEach((id) => {
        refPipeline.hincrby(refCountKey, id.toString(), 1)
      })
      await refPipeline.exec()
    }

    return tagIds
  }

  async #resolveTagIds(tagIds: number[]): Promise<string[]> {
    if (tagIds.length === 0) return []

    const reverseDictKey = this.#getTagReverseDictionaryKey()
    const pipeline = this.redisClient.pipeline()

    tagIds.forEach((id) => {
      pipeline.hget(reverseDictKey, id.toString())
    })

    const results = await pipeline.exec()
    return results?.map((result) => result?.[1] as string).filter(Boolean) || []
  }

  async #decrementTagRefs(tagIds: number[]): Promise<void> {
    if (tagIds.length === 0) return

    const refCountKey = this.#getTagRefCountKey()
    const dictionaryKey = this.#getTagDictionaryKey()

    // Decrement reference counts and collect tags with zero refs
    const pipeline = this.redisClient.pipeline()
    tagIds.forEach((id) => {
      pipeline.hincrby(refCountKey, id.toString(), -1)
    })

    const results = await pipeline.exec()
    const tagsToCleanup: number[] = []

    // Find tags that now have zero references
    results?.forEach((result, index) => {
      if (result && result[1] === 0) {
        tagsToCleanup.push(tagIds[index])
      }
    })

    // Clean up tags with zero references
    if (tagsToCleanup.length) {
      const cleanupPipeline = this.redisClient.pipeline()
      const reverseDictKey = this.#getTagReverseDictionaryKey()

      // Get tag names before deleting them
      const tagNames = await this.#resolveTagIds(tagsToCleanup)

      tagsToCleanup.forEach((id, index) => {
        const idStr = id.toString()

        // Remove from reference count hash
        cleanupPipeline.hdel(refCountKey, idStr)
        // Remove from reverse dictionary
        cleanupPipeline.hdel(reverseDictKey, idStr)
        // Remove from forward dictionary
        if (tagNames[index]) {
          cleanupPipeline.hdel(dictionaryKey, tagNames[index])
        }
      })

      await cleanupPipeline.exec()
    }
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
            "Redis connection error during get operation, returning null to trigger fallback to original data source"
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
                this.logger.warn(`Skipping corrupted cache entry: ${e.message}`)
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
            "Redis connection error during get operation, returning empty array to trigger fallback to original data source"
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

      let tagIds: number[] = []
      if (tags?.length) {
        tagIds = await this.#internTags(tags)
      }

      const setPipeline = this.redisClient.pipeline()

      // Main data with conditional operations
      setPipeline.hsetnx(keyName, "data", finalData)
      if (options && Object.keys(options).length) {
        setPipeline.hset(keyName, "options", JSON.stringify(options))
      }
      if (effectiveTTL) {
        setPipeline.expire(keyName, effectiveTTL)
      }

      // Store tag IDs if present
      if (tags?.length && tagIds.length) {
        const tagsKey = this.#getTagsKey(key)
        const buffer = Buffer.alloc(tagIds.length * 4)
        tagIds.forEach((id, index) => {
          buffer.writeUInt32LE(id, index * 4)
        })

        if (effectiveTTL) {
          setPipeline.set(tagsKey, buffer, "EX", effectiveTTL + 60, "NX")
        } else {
          setPipeline.setnx(tagsKey, buffer)
        }

        // Add tag operations to the same pipeline
        tags.forEach((tag) => {
          const tagKey = this.#getTagKey(tag)
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
          "Redis connection error during set operation, relying on IORedis retry mechanism"
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
        const keyName = this.#getKeyName(key)
        const tagsKey = this.#getTagsKey(key)

        const clearPipeline = this.redisClient.pipeline()

        // Get tags for cleanup and delete main key in same pipeline
        clearPipeline.getBuffer(tagsKey)
        clearPipeline.unlink(keyName)

        const results = await clearPipeline.exec()
        const tagsBuffer = results?.[0]?.[1] as Buffer

        if (tagsBuffer?.length) {
          try {
            // Binary format: array of 32-bit integers
            const tagIds: number[] = []
            for (let i = 0; i < tagsBuffer.length; i += 4) {
              tagIds.push(tagsBuffer.readUInt32LE(i))
            }

            if (tagIds.length) {
              const entryTags = await this.#resolveTagIds(tagIds)

              const tagCleanupPipeline = this.redisClient.pipeline()
              entryTags.forEach((tag) => {
                const tagKey = this.#getTagKey(tag, { isHashed: true })
                tagCleanupPipeline.srem(tagKey, keyName)
              })
              tagCleanupPipeline.unlink(tagsKey)
              await tagCleanupPipeline.exec()

              // Decrement reference counts and cleanup unused tags
              await this.#decrementTagRefs(tagIds)
            }
          } catch (e) {
            // noop - corrupted tag data, skip cleanup
          }
        }

        return
      }

      if (tags?.length) {
        // Handle wildcard tag to clear all cache data
        if (tags.includes("*")) {
          await this.flush()
          return
        }

        // Get all keys associated with the tags
        const pipeline = this.redisClient.pipeline()
        tags.forEach((tag) => {
          const tagKey = this.#getTagKey(tag)
          pipeline.smembers(tagKey)
        })

        const tagResults = await pipeline.exec()

        const allKeys = new Set<string>()

        tagResults?.forEach((result) => {
          if (result && result[1]) {
            ;(result[1] as string[]).forEach((key) => allKeys.add(key))
          }
        })

        if (allKeys.size) {
          // If no options provided (user explicit call), clear everything
          if (!options) {
            const deletePipeline = this.redisClient.pipeline()

            // Delete main keys and options
            Array.from(allKeys).forEach((key) => {
              deletePipeline.unlink(key)
            })

            // Clean up tag references for each key
            const tagDataPromises = Array.from(allKeys).map(async (key) => {
              const keyWithoutPrefix = key.replace(this.keyNamePrefix, "")
              const tagsKey = this.#getTagsKey(keyWithoutPrefix)
              const tagsData = await this.redisClient.getBuffer(tagsKey)
              return { key, tagsKey, tagsData }
            })

            const tagResults = await Promise.all(tagDataPromises)

            // Build single pipeline for all tag cleanup operations
            const tagCleanupPipeline = this.redisClient.pipeline()
            const cleanupPromises = tagResults.map(
              async ({ key, tagsKey, tagsData }) => {
                if (tagsData) {
                  try {
                    // Binary format: array of 32-bit integers
                    const tagIds: number[] = []
                    for (let i = 0; i < tagsData.length; i += 4) {
                      tagIds.push(tagsData.readUInt32LE(i))
                    }

                    if (tagIds.length) {
                      const entryTags = await this.#resolveTagIds(tagIds)
                      entryTags.forEach((tag) => {
                        const tagKey = this.#getTagKey(tag, { isHashed: true })
                        tagCleanupPipeline.srem(tagKey, key)
                      })
                      tagCleanupPipeline.unlink(tagsKey)

                      // Decrement reference counts and cleanup unused tags
                      await this.#decrementTagRefs(tagIds)
                    }
                  } catch (e) {
                    // noop
                  }
                }
              }
            )

            await Promise.all(cleanupPromises)
            await tagCleanupPipeline.exec()
            await deletePipeline.exec()

            return
          }

          // If autoInvalidate is true (strategy call), only clear entries with autoInvalidate=true (default)
          if (options.autoInvalidate === true) {
            const optionsPipeline = this.redisClient.pipeline()

            Array.from(allKeys).forEach((key) => {
              optionsPipeline.hget(key, "options")
            })

            const optionsResults = await optionsPipeline.exec()
            const keysToDelete: string[] = []

            Array.from(allKeys).forEach((key, index) => {
              const optionsResult = optionsResults?.[index]

              if (optionsResult && optionsResult[1]) {
                try {
                  const entryOptions = JSON.parse(optionsResult[1] as string)

                  // Delete if entry has autoInvalidate=true or no setting (default true)
                  const shouldAutoInvalidate =
                    entryOptions.autoInvalidate ?? true

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

            if (keysToDelete.length) {
              const deletePipeline = this.redisClient.pipeline()

              keysToDelete.forEach((key) => {
                deletePipeline.unlink(key)
              })

              // Clean up tag references for each key to delete
              const tagDataPromises = keysToDelete.map(async (key) => {
                const keyWithoutPrefix = key.replace(this.keyNamePrefix, "")
                const tagsKey = this.#getTagsKey(keyWithoutPrefix)
                const tagsData = await this.redisClient.getBuffer(tagsKey)
                return { key, tagsKey, tagsData }
              })

              // Wait for all tag data fetches
              const tagResults = await Promise.all(tagDataPromises)

              // Build single pipeline for all tag cleanup operations
              const tagCleanupPipeline = this.redisClient.pipeline()

              const cleanupPromises = tagResults.map(
                async ({ key, tagsKey, tagsData }) => {
                  if (tagsData) {
                    try {
                      // Binary format: array of 32-bit integers
                      const tagIds: number[] = []
                      for (let i = 0; i < tagsData.length; i += 4) {
                        tagIds.push(tagsData.readUInt32LE(i))
                      }

                      if (tagIds.length) {
                        const entryTags = await this.#resolveTagIds(tagIds)
                        entryTags.forEach((tag) => {
                          const tagKey = this.#getTagKey(tag, {
                            isHashed: true,
                          })
                          tagCleanupPipeline.srem(tagKey, key)
                        })
                        tagCleanupPipeline.unlink(tagsKey) // Delete the tags key

                        // Decrement reference counts and cleanup unused tags
                        await this.#decrementTagRefs(tagIds)
                      }
                    } catch (e) {
                      // noop
                    }
                  }
                }
              )

              await Promise.all(cleanupPromises)
              await tagCleanupPipeline.exec()

              await deletePipeline.exec()

              return
            }
          }
        }
      }
    } catch (error) {
      if (this.isConnectionError(error)) {
        this.logger.warn(
          "Redis connection error during clear operation, relying on IORedis retry mechanism"
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
          "Redis connection error during flush operation, relying on IORedis retry mechanism"
        )
        return
      }
      throw error
    }
  }
}
