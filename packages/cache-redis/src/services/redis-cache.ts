import { Redis } from "ioredis"
import {
  ConfigurableModuleDeclaration,
  MODULE_RESOURCE_TYPE,
  ICacheService,
} from "@medusajs/medusa"
import { MedusaError } from "medusa-core-utils"
import { RedisCacheModuleOptions } from "../types"

const DEFAULT_CACHE_TIME = 30 // 30 seconds
const EXPIRY_MODE = "EX" // "EX" stands for an expiry time in second

type InjectedDependencies = {
  redisClient: Redis
}

class RedisCacheService implements ICacheService {
  protected TTL: number
  protected readonly redis: Redis

  constructor(
    { redisClient }: InjectedDependencies,
    options: RedisCacheModuleOptions = {},
    moduleDeclaration?: ConfigurableModuleDeclaration
  ) {
    this.redis = redisClient
    this.TTL = options.defaultTTL || DEFAULT_CACHE_TIME

    if (moduleDeclaration?.resources !== MODULE_RESOURCE_TYPE.SHARED) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "At the moment this module can only be used with shared resources"
      )
    }
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
    await this.redis.set(key, JSON.stringify(data), EXPIRY_MODE, ttl)
  }

  /**
   * Retrieve a cached value belonging to the given key.
   * @param cacheKey
   */
  async get<T>(cacheKey: string): Promise<T | null> {
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
    const keys = await this.redis.keys(key)
    const pipeline = this.redis.pipeline()

    keys.forEach(function (key) {
      pipeline.del(key)
    })

    await pipeline.exec()
  }
}

export default RedisCacheService
