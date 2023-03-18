import Memcached from "memcached"

/**
 * Module config type
 */
export type MemcachedCacheModuleOptions = {
  /**
   * Time to keep data in cache (in seconds)
   */
  ttl?: number

  location: Memcached.Location

  options?: Memcached.options

  /* TOOD... namespace */
}
