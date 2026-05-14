import { IModuleService, ModuleJoinerConfig } from "../modules-sdk"

type Providers = (string | { 
  /**
   * The ID of the provider to use, as set in `medusa-config.ts`.
   */
  id: string;
  /**
   * Optional custom time-to-live (TTL) (in seconds) for this provider. If not provided, the default TTL configured
   * in the provider is used, or the default TTL of the Caching Module if not configured in the provider.
   */ 
  ttl?: number
})[]

/**
 * @since 2.11.0
 */
export interface ICachingModuleService extends IModuleService {
  // Static trace methods
  // traceGet: (
  //   cacheGetFn: () => Promise<any>,
  //   key: string,
  //   tags: string[]
  // ) => Promise<any>

  // traceSet?: (
  //   cacheSetFn: () => Promise<any>,
  //   key: string,
  //   tags: string[],
  //   options: { autoInvalidate?: boolean }
  // ) => Promise<any>

  // traceClear?: (
  //   cacheClearFn: () => Promise<any>,
  //   key: string,
  //   tags: string[],
  //   options: { autoInvalidate?: boolean }
  // ) => Promise<any>

  /**
   * This method retrieves data from the cache. If neither `key` nor `tags` are provided, or the item is not found, `null` is returned.
   * 
   * @param param0 - The options for retrieving the item.
   * @returns The item(s) that was stored in the cache. If no item was found, or neither `key` nor `tags` were provided, `null` is returned.
   * 
   * @example
   * To retrieve by key:
   * 
   * ```ts
   * const data = await cachingModuleService.get({
   *   key: "products", // this key would typically be a hash
   * }) as { id: string; title: string; }
   * ```
   * 
   * To retrieve by tags:
   * 
   * ```ts
   * const data = await cachingModuleService.get({
   *   tags: ["Product:list:*"],
   * }) as { id: string; title: string; }[]
   * ```
   *
   * To retrieve by key from specific providers:
   * 
   * ```ts
   * const data = await cachingModuleService.get({
   *   key: "products", // this key would typically be a hash
   *   providers: ["caching-redis", "caching-memcached"]
   * }) as { id: string; title: string; }
   * ```
   *
   * This example will try to get the data from the `caching-redis` provider first, and if not found, it will try to get it from the `caching-memcached` provider.
   */
  get({
    key,
    tags,
    providers,
  }: {
    /**
     * The key of the item to retrieve.
     * If both `key` and `tags` are provided, `key` takes precedence over `tags`.
     */
    key?: string
    /**
     * The tags of the items to retrieve. Tags
     * are useful to retrieve multiple related items at once.
     */
    tags?: string[]
    /**
     * The providers to retrieve the item(s) from. You can specify an array of provider IDs.
     * They're checked in the order they're provided in, so make sure to order them based on your priority.
     * If not provided, the [default provider](https://docs.medusajs.com/infrastructure-modules/caching/providers#default-caching-module-provider) is used.
     */
    providers?: string[]
  }): Promise<any | null>

  /**
   * This method stores data in the cache using the 
   * [default Caching Module Provider](https://docs.medusajs.com/infrastructure-modules/caching/providers#default-caching-module-provider).
   *
   * @param param0 - The options for storing the item.
   * @returns A promise that resolves when the item has been stored.
   * 
   * @example
   * To store with key:
   * 
   * ```ts
   * const data = { id: "prod_123", title: "Product 123" }
   * const key = await cachingModuleService.computeKey(data)
   * await cachingModuleService.set({
   *   key,
   *   data
   * })
   * ```
   * 
   * To store with tags:
   * 
   * :::note
   * 
   * Tags should follow [conventions](https://docs.medusajs.com/infrastructure-modules/caching/concepts#caching-tags-convention) to ensure they're automatically invalidated.
   * 
   * :::
   * 
   * ```ts
   * const data = [{ id: "prod_123", title: "Product 123" }]
   * const key = await cachingModuleService.computeKey(data)
   * await cachingModuleService.set({
   *   key,
   *   data,
   *   tags: [`Product:${data[0].id}`, "Product:list:*"]
   * })
   * ```
   * 
   * To disable auto-invalidation for the item:
   * 
   * ```ts
   * const data = [{ id: "prod_123", title: "Product 123" }]
   * const key = await cachingModuleService.computeKey(data)
   * await cachingModuleService.set({
   *   key,
   *   data,
   *   options: { autoInvalidate: false }
   * })
   * ```
   * 
   * The item is now only invalidated when calling the `clear` method directly with the same key or tags.
   * 
   * To store with specific providers:
   * 
   * ```ts
   * const data = { id: "prod_123", title: "Product 123" }
   * const key = await cachingModuleService.computeKey(data)
   * await cachingModuleService.set({
   *   key,
   *   data,
   *   providers: [
   *     "caching-redis",
   *     { id: "caching-memcached", ttl: 120 } // custom TTL for this provider
   *   ]
   * })
   * ```
   * 
   * This example will store the item in both the `caching-redis` and `caching-memcached` providers, with a custom TTL of `120` seconds for the `caching-memcached` provider.
   *
   */
  set({
    key,
    data,
    ttl,
    tags,
    options,
    providers,
  }: {
    /**
     * The key of the item to store.
     */
    key: string
    /**
     * The data to store in the cache.
     */
    data: object
    /**
     * The time-to-live (TTL in seconds) value in seconds.
     * If not provided, the default TTL value configured in the provider should be used.
     */
    ttl?: number
    /**
     * The tags of the items to store. Tags are useful to group related items 
     * together for retrieval or invalidation.
     */
    tags?: string[]
    /**
     * Options for storing the item. The options are stored with the item, allowing you to later match against them when clearing the item.
     * For example, if you set `autoInvalidate: false`, the item will only be invalidated when calling the `clear` method directly with the same key or tags.
     */
    options?: {
      /**
       * Whether to automatically invalidate the item when related data changes.
       *
       * @defaultValue true
       */
      autoInvalidate?: boolean
    }
    /**
     * The providers to store the item(s) in. You can specify an array of provider IDs or an array of objects with provider ID and TTL.
     * If not provided, the [default provider](https://docs.medusajs.com/infrastructure-modules/caching/providers#default-caching-module-provider) is used.
     */
    providers?: Providers
  }): Promise<void>

  /**
   * This method clears data from the cache. If neither `key` nor `tags` are provided, nothing is cleared.
   * 
   * By default, all items matching the key or tags are cleared regardless of their options. If you provide `options.autoInvalidate: true`,
   * only items that were set with `options.autoInvalidate: true` are cleared.
   * 
   * For example, if you set `options.autoInvalidate: true`, only items that were set with `options.autoInvalidate: true` are cleared.
   * Items that were set with `options.autoInvalidate: false` are only cleared when you don't provide any options.
   *
   * @param param0 - The options for clearing the item(s).
   * @returns A promise that resolves when the item(s) have been cleared.
   *
   * @example
   * To invalidate cache by key:
   * 
   * ```ts
   * await cachingModuleService.clear({
   *  key: "products" // this key would typically be a hash
   * })
   * ```
   * 
   * This example will clear the item with the key `products` regardless of its `options.autoInvalidate` value.
   * 
   * To invalidate cache by tags:
   * 
   * ```ts
   * await cachingModuleService.clear({
   *  tags: ["Product:list:*"]
   * })
   * ```
   * 
   * This example will clear all items with the tag `Product:list:*` regardless of their `options.autoInvalidate` value.
   * 
   * To invalidate only the cache data that were set to automatically invalidate:
   * 
   * ```ts
   * await cachingModuleService.clear({
   *  tags: ["Product:list:*"],
   *  options: { autoInvalidate: true }
   * })
   * ```
   * 
   * This example will only clear items with the tag `Product:list:*` that were set with `options.autoInvalidate: true`.
   * Items that were set with `options.autoInvalidate: false` will not be cleared.
   * 
   * :::note
   * 
   * Setting `options.autoInvalidate: false` when calling the `clear` method will not clear any items.
   * To clear items that were set with `options.autoInvalidate: false`, you must call the `clear` method without any options.
   * 
   * :::
   * 
   * To invalidate cache from specific providers:
   * 
   * ```ts
   * await cachingModuleService.clear({
   *  key: "products",
   *  providers: ["caching-redis", "caching-memcached"]
   * })
   * ```
   * 
   * This example will try to clear the data from both the `caching-redis` and `caching-memcached` providers.
   */
  clear({
    key,
    tags,
    options,
    providers,
  }: {
    /**
     * The key of the item to clear.
     */
    key?: string
    /**
     * The tags of the items to clear. Tags
     * are useful to clear multiple related items at once.
     */
    tags?: string[]
    /**
     * Options for clearing the item(s). The options are matched against the stored options when the item was set.
     * For example, if the item was set with `autoInvalidate: true`, it will only be cleared if the `autoInvalidate` option is also set to `true`.
     * If not provided, all items matching the key or tags are cleared regardless of their options.
     */
    options?: {
      /**
       * Whether to clear item(s) that were set to automatically invalidate.
       */
      autoInvalidate?: boolean
    }
    /**
     * The providers from which to clear the item(s). You can specify an array of provider IDs.
     * If not provided, the [default provider](https://docs.medusajs.com/infrastructure-modules/caching/providers#default-caching-module-provider) is used.
     */
    providers?: string[]
  }): Promise<void>

  /**
   * This method computes a cache key based on the input object. It's useful to generate consistent and unique keys for caching.
   * 
   * @param input - The input object to compute the key from.
   * @returns The computed cache key.
   * 
   * @example
   * const key = await cachingModuleService.computeKey({
   *   id: "prod_123",
   *   title: "Product 123"
   * })
   * // key will be a hash string like "a1b2c3d4e5f6g7h8i9j0"
   */
  computeKey(input: object): Promise<string>

  /**
   * This method computes cache tags based on the input object. It's useful to generate consistent and relevant tags for caching.
   * 
   * @param input - The input object to compute the tags from.
   * @param options - Additional options to influence tag computation.
   * @returns An array of computed cache tags.
   * 
   * @example
   * const tags = await cachingModuleService.computeTags({
   *   products: [{ id: "prod_123" }, { id: "prod_456" }],
   * }, {
   *   operation: "updated"
   * })
   * // tags might be ["Product:prod_123", "Product:prod_456", "Product:list:*"]
   */
  computeTags(input: object, options?: Record<string, any>): Promise<string[]>
}

/**
 * ### constructor
 *
 * The constructor allows you to access resources from the module's container using the first parameter,
 * and the module's options using the second parameter.
 *
 * If you're creating a client or establishing a connection with a third-party service, do it in a [Loader](https://docs.medusajs.com/learn/fundamentals/modules/loaders)
 * and store it in the Module's container. Then, you can access it in your service using the container.
 * 
 * :::note[Loader Example]
 * 
 * [Initialize MongoDB client in loader and access it in service](https://docs.medusajs.com/learn/fundamentals/modules/loaders#example-register-custom-mongodb-connection).
 * 
 * :::
 *
 * #### Example
 *
 * ```ts
 * import { ICachingProviderService } from "@medusajs/framework/types"
 * import { Logger } from "@medusajs/framework/types"
 *
 * type InjectedDependencies = {
 *   logger: Logger
 *   // assuming you initialized a client
 *   // in a Loader and stored it in the container
 *   client: Client
 * }
 *
 * type Options = {
 *   url: string
 * }
 *
 * class MyCachingModuleProvider implements ICachingProviderService {
 *   static identifier = "my-cache"
 *   protected logger_: Logger
 *   protected options_: Options
 *   protected client
 *
 *   constructor (
 *     { logger, client }: InjectedDependencies,
 *     options: Options
 *   ) {
 *     this.logger_ = logger
 *     this.options_ = options
 *     // set the service's client to
 *     // the client from the container
 *     this.client = client
 *   }
 *
 *   // ...
 * }
 *
 * export default MyCachingModuleProvider
 * ```
 * 
 * ### Identifier
 *
 * Every caching module provider must have an `identifier` static property. The provider's ID
 * will be stored as `lp_{identifier}_{id}`, where `id` is the ID you set in your `medusa-config.ts` file.
 * 
 * For example:
 * 
 * ```ts
 * class MyCachingModuleProvider implements ICachingProviderService {
 *   static identifier = "my-cache"
 *   // ...
 * }
 * ```
 */
export interface ICachingProviderService {
  /**
   * This method retrieves data from the cache either by `key` or `tags`. If neither `key` nor `tags` are provided, `null` should be returned.
   * If both `key` and `tags` are provided, `key` should take precedence over `tags`.
   * 
   * @param param0 - The parameters for retrieving the item.
   * @returns The item(s) that was stored in the cache, or `null` if not found.
   * 
   * @example
   * class MyCachingModuleProvider implements ICachingProviderService {
   *   // ...
   *   async get({ key, tags }: { key?: string; tags?: string[] }): Promise<any> {
   *     // Assuming you're using a client to get data
   *     if (key) {
   *       return await this.client.get({ key })
   *     }
   *     if (tags) {
   *       return await this.client.getByTags({ tags })
   *     }
   *     return null
   *   }
   * }
   */
  get({ key, tags }: { 
    /**
     * The key of the item to retrieve. If both are provided, `key` should take precedence over `tags`.
     */
    key?: string; 
    /**
     * The tags of the items to retrieve. All items with any of the provided tags should be retrieved.
     */
    tags?: string[]
  }): Promise<any>
  /**
   * This method stores data in the cache. It should also store the options with the item, 
   * allowing you to later to check the `autoInvalidate` option when clearing the item.
   * 
   * @param param0 - The parameters for storing the item.
   * @return A promise that resolves when the item has been stored.
   * 
   * @example
   * class MyCachingModuleProvider implements ICachingProviderService {
   *   // ...
   *   async set({ key, data, ttl, tags, options }: { 
   *     key: string; 
   *     data: any; 
   *     ttl?: number; 
   *     tags?: string[]; 
   *     options?: { autoInvalidate?: boolean } 
   *   }): Promise<void> {
   *     // Assuming you're using a client to set data
   *     await this.client.set({ key, data, ttl, tags })
   *     await this.client.set({ key, data: options, pipeline: "options" })
   *   }
   * }
   */
  set({
    key,
    data,
    ttl,
    tags,
    options,
  }: {
    /**
     * The key of the item to store.
     */
    key: string
    /**
     * The data to store in the cache.
     */
    data: object
    /**
     * The time-to-live (TTL in seconds) value in seconds.
     * If not provided, the default TTL value configured in the provider should be used.
     */
    ttl?: number
    /**
     * The tags of the items to store. Items should be grouped together using tags for retrieval or invalidation.
     */
    tags?: string[]
    /**
     * Options for storing the item. The options should be stored with the item, allowing you to later match against them when clearing the item.
     * For example, if you set `autoInvalidate: false`, the item will only be invalidated when calling the `clear` method directly with the same key or tags.
     */
    options?: {
      /**
       * Whether to automatically invalidate the item when related data changes.
       */ 
      autoInvalidate?: boolean
    }
  }): Promise<void>
  /**
   * This method clears data from the cache. If no options are specified, all items matching the key or tags should be cleared.
   * Otherwise, if `options.autoInvalidate` is `true`, only items that were set with `options.autoInvalidate: true` should be cleared.
   * 
   * Items with `options.autoInvalidate: false` should only be cleared when no options are provided.
   * 
   * If neither `key` nor `tags` are provided, nothing should be cleared.
   * 
   * @param param0 - The parameters for clearing the item(s).
   * @returns A promise that resolves when the item(s) have been cleared.
   * 
   * @example
   * async clear({ key, tags, options, }: { 
   *   key?: string; 
   *   tags?: string[]; 
   *   options?: { autoInvalidate?: boolean }
   * }): Promise<void> {
   *   if (!options) {
   *     // clear all items
   *     await this.client.invalidate({ key, tags })
   *   } else if (options.autoInvalidate) {
   *     // clear only items with autoInvalidate option set to true
   *     const keysToDelete: string[] = []
   *     const storedOptions = await this.client.get({ key, tags, pipeline: "options" })
   *     storedOptions.forEach((item) => {
   *       if (item.autoInvalidate) {
   *         keysToDelete.push(item.key as string)
   *       }
   *     })
   *     await this.client.invalidate({ keys: keysToDelete })
   *   }
   * }
   */
  clear({
    key,
    tags,
    options,
  }: {
    /**
     * The key of the item to clear.
     */
    key?: string
    /**
     * The tags of the items to clear. All items with any of the provided tags should be cleared.
     */
    tags?: string[]
    /**
     * Options for clearing the item(s). The options should be matched against the stored options when the item was set.
     * For example, if the item was set with `autoInvalidate: true`, it will only be cleared if the `autoInvalidate` option is also set to `true`.
     * If not provided, all items matching the key or tags should be cleared regardless of their options.
     */
    options?: {
      /**
       * Whether to clear item(s) that were set to automatically invalidate.
       */ 
      autoInvalidate?: boolean
    }
  }): Promise<void>
}

/**
 * @ignore
 */
export interface EntityReference {
  type: string
  id: string | number
  field?: string
}

/**
 * @ignore
 */
export interface ICachingStrategy {
  /**
   * This method is called when the application starts. It can be useful to set up some auto
   * invalidation logic that reacts to something.
   *
   * @param container MedusaContainer
   * @param schema GraphQLSchema
   * @param cacheModule ICachingModuleService
   */
  onApplicationStart?(
    schema: any,
    joinerConfigs: ModuleJoinerConfig[]
  ): Promise<void>

  onApplicationPrepareShutdown?(): Promise<void>

  onApplicationShutdown?(): Promise<void>

  computeKey(input: object): Promise<string>

  computeTags(input: object, options?: Record<string, any>): Promise<string[]>
}
