import {
  Logger,
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@medusajs/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export const PaymentProviderRegistrationPrefix = "pp_"

export type PaymentModuleOptions = Partial<ModuleServiceInitializeOptions> & {
  /**
   * Providers to be registered
   */
  providers?: {
    /**
     * The module provider to be registered
     */
    resolve: string | ModuleProviderExports
    options: {
      /**
       * key value pair of the provider name and the configuration to be passed to the provider constructor
       */
      config: Record<string, unknown>
    }
  }[]
}
