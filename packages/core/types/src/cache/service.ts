export interface ICacheService {
  /**
   * This method retrieves data from the cache.
   * 
   * @param key - The key of the item to retrieve.
   * @returns The item that was stored in the cache. If the item was not found, null is returned.
   * 
   * @example
   * const data = await cacheModuleService.get("my-key")
   */
  get<T>(key: string): Promise<T | null>
  /**
   * This method stores data in the cache.
   * 
   * @param key - The key of the item to store.
   * @param data - The data to store in the cache.
   * @param ttl - The time-to-live (TTL) value in seconds. If not provided, the default TTL value is used. The default value is based on the used Cache Module.
   * 
   * @example
   * await cacheModuleService.set("my-key", { product_id: "prod_123" }, 60)
   */
  set(key: string, data: unknown, ttl?: number): Promise<void>
  /**
   * This method removes an item from the cache.
   * 
   * @param key - The key of the item to remove.
   * 
   * @example
   * await cacheModuleService.invalidate("my-key")
   */
  invalidate(key: string): Promise<void>
  /**
   * This method atomically increments a numeric counter in the cache. If the
   * counter doesn't exist, it's created with the value `1`.
   *
   * @param key - The key of the counter to increment.
   * @param ttl - The time-to-live (TTL) value in seconds of the counter.
   * @returns The value of the counter after the increment.
   *
   * @example
   * const attempts = await cacheModuleService.increment("my-counter", 60)
   */
  increment?(key: string, ttl?: number): Promise<number>
}
