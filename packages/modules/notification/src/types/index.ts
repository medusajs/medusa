import {
  Logger,
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@medusajs/framework/types"

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
       * key value pair of the configuration to be passed to the provider constructor, plus the channels supported by the provider
       */
      options?: Record<string, unknown> & { channels: string[] }
    }[]
    /**
     * Options for the default Medusa Cloud Email provider
     * @private
     */
    cloud?: MedusaCloudEmailOptions
  }

export type MedusaCloudEmailOptions = {
  api_key: string
  endpoint: string
  environment_handle?: string
  sandbox_handle?: string
}

declare module "@medusajs/types" {
  interface ModuleOptions {
    "@medusajs/notification": NotificationModuleOptions
    "@medusajs/medusa/notification": NotificationModuleOptions
  }
}
