import { RedisOptions } from "ioredis"

/**
 * @deprecated Pass ioredis options in `redisOptions` instead of at the top
 * level, for consistency with the other Redis modules.
 */
type DeprecatedTopLevelRedisOptions = RedisOptions

export interface RedisCacheModuleOptions
  extends DeprecatedTopLevelRedisOptions {
  /**
   * Redis connection string
   */
  redisUrl?: string
  /**
   * Options passed to the ioredis client
   */
  redisOptions?: RedisOptions
  /**
   * TTL in milliseconds
   */
  ttl?: number
  /**
   * Key prefix for all cache keys
   */
  prefix?: string
  /**
   * Minimum size in bytes to compress data (default: 1024)
   */
  compressionThreshold?: number
}
