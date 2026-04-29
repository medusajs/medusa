import {
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@medusajs/framework/types"

export type AnalyticsModuleOptions = Partial<ModuleServiceInitializeOptions> & {
  /**
   * Providers to be registered
   */
  providers?: {
    /**
     * The module provider to be registered
     */
    resolve: string | ModuleProviderExports
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
    "@medusajs/analytics": AnalyticsModuleOptions
    "@medusajs/medusa/analytics": AnalyticsModuleOptions
  }
}
