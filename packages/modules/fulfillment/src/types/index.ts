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
