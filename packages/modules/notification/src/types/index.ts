import {
  Logger,
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@medusajs/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export const NotificationIdentifiersRegistrationName =
  "notification_providers_identifier"

export const NotificationProviderRegistrationPrefix = "np_"

export type NotificationModuleOptions =
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
