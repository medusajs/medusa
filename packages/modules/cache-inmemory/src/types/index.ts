/**
 * Shape of a record saved in `in-memory`  cache
 */
export type CacheRecord<T> = {
  data: T
  /**
   * Timestamp in milliseconds
   */
  expire: number
}

export type InMemoryCacheModuleOptions = {
  /**
   * Time to keep data in cache (in seconds)
   */
  ttl?: number
}

declare module "@zjedene-medusa/types" {
  interface ModuleOptions {
    "@zjedene-medusa/cache-inmemory": InMemoryCacheModuleOptions
    "@zjedene-medusa/medusa/cache-inmemory": InMemoryCacheModuleOptions
  }
}
