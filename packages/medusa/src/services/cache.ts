import { Redis } from "ioredis"
import { ICacheService } from "../interfaces"

const DEFAULT_CACHE_TIME = 60 * 60 // 60 seconds

export default class CacheService implements ICacheService {
  protected readonly redis_: Redis

  constructor({ redisClient }) {
    this.redis_ = redisClient
  }

  async set(
    key: string,
    data: Record<string, unknown>,
    ttl: number = DEFAULT_CACHE_TIME
  ): Promise<void> {
    await this.redis_.set(key, JSON.stringify(data), "EX", ttl)
  }

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
