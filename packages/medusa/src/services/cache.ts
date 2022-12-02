import { Redis } from "ioredis"
import { ICacheService } from "../interfaces"

const DEFAULT_CACHE_TIME = 30 // 30 seconds

export default class CacheService implements ICacheService {
  protected readonly redis_: Redis

  constructor({ redisClient }) {
    this.redis_ = redisClient
  }

  /**
   * Set a key/value pair to the cache.
   * It is also possible to manage the ttl through environment variable using CACHE_TTL. If the ttl is 0 it will
   * act like the value should not be cached at all.
   * @param key
   * @param data
   * @param ttl
   */
  async set(
    key: string,
    data: Record<string, unknown>,
    ttl: number = DEFAULT_CACHE_TIME
  ): Promise<void> {
    ttl = Number(process.env.CACHE_TTL ?? ttl)
    await this.redis_.set(key, JSON.stringify(data), "EX", ttl)
  }

  /**
   * Retrieve a cached value belonging to the given key.
   * @param cacheKey
   */
  async get<T>(cacheKey: string): Promise<T | null> {
    try {
      const cached = await this.redis_.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (err) {
      await this.redis_.del(cacheKey)
    }
    return null
  }

  /**
   * Invalidate cache for a specific key. a key can be either a specific key or more global such as "ps:*".
   * @param key
   */
  async invalidate(key: string): Promise<void> {
    await this.redis_.del()
    const keys = await this.redis_.keys(key)
    const pipeline = this.redis_.pipeline()

    keys.forEach(function (key) {
      pipeline.del(key)
    })

    await pipeline.exec()
  }
}
