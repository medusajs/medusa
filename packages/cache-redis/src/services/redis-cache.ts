import { ICacheService } from "@medusajs/types"
import { Redis } from "ioredis"
import { RedisCacheModuleOptions } from "../types"

const DEFAULT_NAMESPACE = "medusa"
const DEFAULT_CACHE_TIME = 30 // 30 seconds
const EXPIRY_MODE = "EX" // "EX" stands for an expiry time in second

type InjectedDependencies = {
  cacheRedisConnection: Redis
}

class RedisCacheService implements ICacheService {
  protected readonly TTL: number
  protected readonly redis: Redis
  private readonly namespace: string

  constructor(
    { cacheRedisConnection }: InjectedDependencies,
    options: RedisCacheModuleOptions = {}
  ) {
    this.redis = cacheRedisConnection
    this.TTL = options.ttl ?? DEFAULT_CACHE_TIME
    this.namespace = options.namespace || DEFAULT_NAMESPACE
  }
  /**
   * Set a key/value pair to the cache.
   * If the ttl is 0 it will act like the value should not be cached at all.
   * @param key
   * @param data
   * @param ttl
   */
  async set(
    key: string,
    data: Record<string, unknown>,
    ttl: number = this.TTL
  ): Promise<void> {
    await this.redis.set(
      this.getCacheKey(key),
      JSON.stringify(data),
      EXPIRY_MODE,
      ttl
    )
  }

  /**
   * Retrieve a cached value belonging to the given key.
   * @param cacheKey
   */
  async get<T>(cacheKey: string): Promise<T | null> {
    cacheKey = this.getCacheKey(cacheKey)
    try {
      const cached = await this.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (err) {
      await this.redis.del(cacheKey)
    }
    return null
  }

  /**
   * Invalidate cache for a specific key. a key can be either a specific key or more global such as "ps:*".
   * @param key
   */
  async invalidate(key: string): Promise<void> {
    const keys = await this.redis.keys(this.getCacheKey(key))
    const pipeline = this.redis.pipeline()

    keys.forEach(function (key) {
      pipeline.del(key)
    })

    await pipeline.exec()
  }

  /**
   * Returns namespaced cache key
   * @param key
   */
  private getCacheKey(key: string) {
    return this.namespace ? `${this.namespace}:${key}` : key
  }
}

export default RedisCacheService
