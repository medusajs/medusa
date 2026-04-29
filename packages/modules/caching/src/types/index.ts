import type {
  Constructor,
  ICachingStrategy,
  IEventBusModuleService,
  Logger,
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { default as CacheProviderService } from "../services/cache-provider"

export const CachingDefaultProvider = "default_provider"
export const CachingIdentifiersRegistrationName = "caching_providers_identifier"

export const CachingProviderRegistrationPrefix = "lp_"

export type InjectedDependencies = {
  cacheProviderService: CacheProviderService
  hasher: (data: string) => string
  logger?: Logger
  strategy: Constructor<ICachingStrategy>
  [CachingDefaultProvider]: string
  [Modules.EVENT_BUS]: IEventBusModuleService
}

export interface MemoryCacheModuleOptions {
  /**
   * TTL in seconds
   */
  ttl?: number
  /**
   * Maximum number of keys to store (see node-cache documentation)
   */
  maxKeys?: number
  /**
   * Check period for expired keys in seconds (see node-cache documentation)
   */
  checkPeriod?: number
  /**
   * Use clones for cached data (see node-cache documentation)
   */
  useClones?: boolean
  /**
   * Maximum size of the cache in bytes (default 300MB).
   * It is an approximation, if a new entry will make the limit exceeded, the entry will be cached
   * but not the following ones
   */
  maxSize?: number
}

export type CachingModuleOptions = Partial<ModuleServiceInitializeOptions> & {
  /**
   * The strategy to be used. Default to the inbuilt default strategy.
   */
  // strategy?: ICachingStrategy
  /**
   * Time to keep data in cache (in seconds)
   */
  ttl?: number

  /**
   * Enable and configure the built in memory cache
   * @private
   */
  in_memory?: MemoryCacheModuleOptions & {
    enable?: boolean
  }

  /**
   * Providers to be registered
   */
  providers?: {
    /**
     * The module provider to be registered
     */
    resolve: string | ModuleProviderExports
    /**
     * If the provider is the default
     */
    is_default?: boolean
    /**
     * The id of the provider
     */
    id: string
    /**
     * key value pair of the configuration to be passed to the provider constructor
     */
    options?: Record<string, unknown>
  }[]
}

declare module "@medusajs/types" {
  interface ModuleOptions {
    "@medusajs/caching": CachingModuleOptions
    "@medusajs/medusa/caching": CachingModuleOptions
  }
}
