import {
  IEventBusModuleService,
  Logger,
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@medusajs/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
  eventBusModuleService?: IEventBusModuleService
}

export const FulfillmentIdentifiersRegistrationName =
  "fulfillment_providers_identifier"

export const FulfillmentProviderRegistrationPrefix = "fp_"

export type FulfillmentModuleOptions =
  Partial<ModuleServiceInitializeOptions> & {
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
