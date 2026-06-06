import {
  Logger,
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@zjedene-medusa/framework/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export type PaymentModuleOptions = Partial<ModuleServiceInitializeOptions> & {
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

declare module "@zjedene-medusa/types" {
  interface ModuleOptions {
    "@zjedene-medusa/payment": PaymentModuleOptions
    "@zjedene-medusa/medusa/payment": PaymentModuleOptions
  }
}
