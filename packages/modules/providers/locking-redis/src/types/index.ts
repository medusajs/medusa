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
   * @default 20
   */
  defaultRetryInterval?: number

  /**
   * Maximum retry interval (in milliseconds)
   * @default 1000
   */
  maximumRetryInterval?: number

  /**
   * Backoff factor for retries
   * @default 2
   */
  backoffFactor?: number
}
