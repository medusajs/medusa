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
   * @default `medusa_lock:`
   */
  namespace?: string

  /**
   * Time to wait for lock (in seconds)
   * @default 5
   */
  waitLockingTimeout?: number

  /**
   * Default retry interval (in milliseconds)
   * @default 5
   */
  defaultRetryInterval?: number

  /**
   * Maximum retry interval (in milliseconds)
   * @default 200
   */
  maximumRetryInterval?: number
}
