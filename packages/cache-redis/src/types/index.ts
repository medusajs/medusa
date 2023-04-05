import { RedisOptions } from "ioredis"

/**
 * Module config type
 */
export type RedisCacheModuleOptions = {
  /**
   * Time to keep data in cache (in seconds)
   */
  ttl?: number

  /**
   * Redis connection string
   */
  redisUrl?: string

  /**
   * Redis client options
   */
  redisOptions?: RedisOptions

  /**
   * Prefix for event keys
   * @default `medusa:`
   */
  namespace?: string
}
