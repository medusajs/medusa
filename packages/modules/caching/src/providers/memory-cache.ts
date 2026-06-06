import NodeCache from "node-cache"
import type { ICachingProviderService, Logger } from "@zjedene-medusa/framework/types"
import { MemoryCacheModuleOptions } from "@types"

const THREE_HUNDRED_MB = 300 * 1024 * 1024

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${Math.round(bytes / 1024 / 1024)} MB`
}

export class MemoryCachingProvider implements ICachingProviderService {
  static identifier = "cache-memory"

  protected logger: Logger
  protected cacheClient: NodeCache
  protected tagIndex: Map<string, Set<string>> = new Map() // tag -> keys
  protected keyTags: Map<string, Set<string>> = new Map() // key -> tags
  protected entryOptions: Map<string, { autoInvalidate?: boolean }> = new Map() // key -> options
  protected keySizes: Map<string, number> = new Map() // key -> approximate size in bytes
  protected approximateMemoryUsage: number = 0
  protected options: MemoryCacheModuleOptions
  protected maxSize: number
  protected hasher: (key: string) => string

  constructor(
    { logger, hasher }: { logger?: Logger; hasher: (key: string) => string },
    options: MemoryCacheModuleOptions = {}
  ) {
    this.logger = logger ?? (console as unknown as Logger)
    const { maxSize, ...rest } = options
    this.maxSize = maxSize ?? THREE_HUNDRED_MB

    this.hasher = hasher

    this.options = {
      ttl: 3600,
      maxKeys: 25000,
      checkPeriod: 60, // 10 minutes
      useClones: false, // Default to false for speed, true would be slower but safer. we can ...discuss
      ...rest,
    }

    const cacheClient = new NodeCache({
      stdTTL: this.options.ttl,
      maxKeys: this.options.maxKeys,
      checkperiod: this.options.checkPeriod,
      useClones: this.options.useClones,
    })

    this.cacheClient = cacheClient

    // Clean up tag indices when keys expire
    this.cacheClient.on("expired", (key: string) => {
      this.cleanupTagReferences(key)
    })

    this.cacheClient.on("del", (key: string) => {
      this.cleanupTagReferences(key)
    })
  }

  private calculateEntrySize(
    key: string,
    data: object,
    tags?: string[]
  ): number {
    const dataSize = Buffer.byteLength(JSON.stringify(data), "utf8")
    const keySize = Buffer.byteLength(key, "utf8")

    let tagsSize = 0
    if (tags?.length) {
      tagsSize = Buffer.byteLength(JSON.stringify(tags), "utf8")
    }

    return dataSize + keySize + tagsSize
  }

  private cleanupTagReferences(key: string): void {
    const tags = this.keyTags.get(key)
    if (tags) {
      tags.forEach((tag) => {
        const keysForTag = this.tagIndex.get(tag)
        if (keysForTag) {
          keysForTag.delete(key)
          if (keysForTag.size === 0) {
            this.tagIndex.delete(tag)
          }
        }
      })
      this.keyTags.delete(key)
    }

    // Clean up memory tracking
    const keySize = this.keySizes.get(key)
    if (keySize) {
      this.approximateMemoryUsage -= keySize
      this.keySizes.delete(key)
    }

    // Also clean up entry options
    this.entryOptions.delete(key)
  }

  async get({ key, tags }: { key?: string; tags?: string[] }): Promise<any> {
    if (key) {
      const hashedKey = this.hasher(key)
      return this.cacheClient.get(hashedKey) ?? null
    }

    if (tags?.length) {
      const allKeys = new Set<string>()

      tags.forEach((tag) => {
        const hashedTag = this.hasher(tag)
        const keysForTag = this.tagIndex.get(hashedTag)
        if (keysForTag) {
          keysForTag.forEach((key) => allKeys.add(key))
        }
      })

      if (allKeys.size === 0) {
        return []
      }

      const results: any[] = []
      allKeys.forEach((key) => {
        const value = this.cacheClient.get(key)
        if (value !== undefined) {
          results.push(value)
        }
      })

      return results
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
    // Only reject if we're already over the limit
    if (this.approximateMemoryUsage > this.maxSize) {
      this.logger.warn(
        `Cache is full. Current usage: ${formatBytes(
          this.approximateMemoryUsage
        )}, Max: ${formatBytes(this.maxSize)}. Skipping cache entry.`
      )
      return
    }

    const hashedKey = this.hasher(key)
    const hashedTags = tags?.map((tag) => this.hasher(tag))

    const totalSize = this.calculateEntrySize(hashedKey, data, hashedTags)

    // Set the cache entry
    const effectiveTTL = ttl ?? this.options.ttl ?? 3600
    this.cacheClient.set(hashedKey, data, effectiveTTL)

    // Handle tags if provided
    if (hashedTags?.length) {
      // Clean up any existing tag references for this key
      this.cleanupTagReferences(hashedKey)

      const tagSet = new Set(hashedTags)
      this.keyTags.set(hashedKey, tagSet)

      // Add this key to each tag's index
      hashedTags.forEach((tag) => {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set())
        }
        this.tagIndex.get(tag)!.add(hashedKey)
      })
    }

    // Store entry options if provided
    if (
      Object.keys(options ?? {}).length &&
      !Object.values(options ?? {}).every((value) => value === undefined)
    ) {
      this.entryOptions.set(hashedKey, options!)
    }

    // Track memory usage
    const existingSize = this.keySizes.get(hashedKey) || 0
    this.approximateMemoryUsage =
      this.approximateMemoryUsage - existingSize + totalSize
    this.keySizes.set(hashedKey, totalSize)
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
    if (key) {
      const hashedKey = this.hasher(key)
      this.cacheClient.del(hashedKey)
      return
    }

    if (tags?.length) {
      // Handle wildcard tag to clear all cache data
      if (tags?.includes("*")) {
        this.cacheClient.flushAll()
        this.tagIndex.clear()
        this.keyTags.clear()
        this.entryOptions.clear()
        return
      }

      const hashedTags = tags.map((tag) => this.hasher(tag))
      const allKeys = new Set<string>()

      hashedTags.forEach((tag) => {
        const keysForTag = this.tagIndex.get(tag)
        if (keysForTag) {
          keysForTag.forEach((key) => allKeys.add(key))
        }
      })

      if (allKeys.size) {
        // If no options provided (user explicit call), clear everything
        if (!options) {
          const keysToDelete = Array.from(allKeys)
          this.cacheClient.del(keysToDelete)

          // Clean up ALL tag references for deleted keys
          keysToDelete.forEach((key) => {
            this.cleanupTagReferences(key)
          })
          return
        }

        // If autoInvalidate is true (strategy call), only clear entries with autoInvalidate=true (default)
        if (options.autoInvalidate === true) {
          const keysToDelete: string[] = []

          allKeys.forEach((key) => {
            const entryOptions = this.entryOptions.get(key)
            // Delete if entry has autoInvalidate=true or no setting (default true)
            const shouldAutoInvalidate = entryOptions?.autoInvalidate ?? true
            if (shouldAutoInvalidate) {
              keysToDelete.push(key)
            }
          })

          if (keysToDelete.length) {
            this.cacheClient.del(keysToDelete)

            // Clean up ALL tag references for deleted keys
            keysToDelete.forEach((key) => {
              this.cleanupTagReferences(key)
            })
          }
        }
      }
    }
  }
}
