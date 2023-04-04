import Memcached from "memcached"

import { ICacheService } from "@medusajs/types"

import { MemcachedCacheModuleOptions } from "../types"

const DEFAULT_NAMESPACE = "medusa"
const DEFAULT_CACHE_TIME = 30 // 30 seconds

type InjectedDependencies = {
  cacheMemcachedConnection: Memcached
}

class MemcachedCacheService implements ICacheService {
  protected readonly TTL: number
  private readonly namespace: string
  protected readonly memcached: Memcached

  constructor(
    { cacheMemcachedConnection }: InjectedDependencies,
    options: MemcachedCacheModuleOptions
  ) {
    this.memcached = cacheMemcachedConnection
    this.TTL = options.ttl || DEFAULT_CACHE_TIME
    this.namespace = options.namespace || DEFAULT_NAMESPACE
  }
  /**
   * Set a key/value pair to the cache.
   * @param key
   * @param data
   * @param ttl
   */
  async set(
    key: string,
    data: Record<string, unknown>,
    ttl: number = this.TTL
  ): Promise<void> {
    return new Promise((res, rej) =>
      this.memcached.set(
        this.getCacheKey(key),
        JSON.stringify(data),
        ttl,
        (err) => {
          if (err) {
            rej(err)
          } else {
            res()
          }
        }
      )
    )
  }

  /**
   * Retrieve a cached value belonging to the given key.
   * @param cacheKey
   */
  async get<T>(cacheKey: string): Promise<T | null> {
    return new Promise((res) => {
      this.memcached.get(this.getCacheKey(cacheKey), (err, data) => {
        if (err) {
          res(null)
        } else {
          if (data) {
            res(JSON.parse(data))
          } else {
            res(null)
          }
        }
      })
    })
  }

  /**
   * Invalidate cache for a specific key.
   * @param key
   */
  async invalidate(key: string): Promise<void> {
    return new Promise((res, rej) => {
      this.memcached.del(this.getCacheKey(key), (err) => {
        if (err) {
          rej(err)
        } else {
          res()
        }
      })
    })
  }

  /**
   * Returns namespaced cache key
   * @param key
   */
  private getCacheKey(key: string) {
    return this.namespace ? `${this.namespace}:${key}` : key
  }
}

export default MemcachedCacheService
