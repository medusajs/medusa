import { ConfigurableModuleDeclaration } from "@medusajs/modules-sdk"
import { ICacheService } from "@medusajs/medusa"

import { CacheRecord, InMemoryCacheModuleOptions } from "../types"

const DEFAULT_TTL = 30 // seconds

type InjectedDependencies = {}

/**
 * Class represents basic, in-memory, cache store.
 */
class InMemoryCacheService implements ICacheService {
  protected TTL: number

  protected readonly store = new Map<string, CacheRecord<any>>()
  protected readonly timoutRefs = new Map<string, NodeJS.Timeout>()

  constructor(
    deps: InjectedDependencies,
    options: InMemoryCacheModuleOptions = {},
    moduleDeclaration?: ConfigurableModuleDeclaration
  ) {
    this.TTL = options.ttl || DEFAULT_TTL
  }

  /**
   * Retrieve data from the cache.
   * @param key - cache key
   */
  async get<T>(key: string): Promise<T | null> {
    const now = Date.now()
    const record: CacheRecord<T> | undefined = this.store.get(key)

    if (!record || (record.expire && record.expire < now)) {
      return null
    }

    return record.data
  }

  /**
   * Set data to the cache.
   * @param key - cache key under which the data is stored
   * @param data - data to be stored in the cache
   * @param ttl - expiration time in seconds
   */
  async set<T>(key: string, data: T, ttl: number = this.TTL): Promise<void> {
    const record: CacheRecord<T> = { data, expire: ttl * 1000 + Date.now() }

    const oldRecord = this.store.get(key)

    if (oldRecord) {
      clearTimeout(this.timoutRefs.get(key))
      this.timoutRefs.delete(key)
    }

    const ref = setTimeout(() => {
      this.invalidate(key)
    }, ttl * 1000)

    this.timoutRefs.set(key, ref)
    this.store.set(key, record)
  }

  /**
   * Delete data from the cache.
   * @param key - cache key
   */
  async invalidate(key: string): Promise<void> {
    const timeoutRef = this.timoutRefs.get(key)
    if (timeoutRef) {
      clearTimeout(timeoutRef)
      this.timoutRefs.delete(key)
    }
    this.store.delete(key)
  }

  /**
   * Delete the entire cache.
   */
  async clear() {
    this.timoutRefs.forEach((ref) => clearTimeout(ref))
    this.timoutRefs.clear()

    this.store.clear()
  }
}

export default InMemoryCacheService
