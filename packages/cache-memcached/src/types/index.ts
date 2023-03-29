import Memcached from "memcached"

/**
 * Module config type
 */
export type MemcachedCacheModuleOptions = {
  /**
   * Time to keep data in cache (in seconds)
   */
  ttl?: number

  /**
   * Memcached client options
   */
  location: Memcached.Location
  options?: Memcached.options

  /**
   * Prefix for event keys
   * @default `medusa:`
   */
  namespace?: string
}
