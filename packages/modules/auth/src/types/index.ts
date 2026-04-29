import {
  Logger,
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@medusajs/framework/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export const AuthIdentifiersRegistrationName = "auth_providers_identifier"

export const AuthProviderRegistrationPrefix = "au_"

export type AuthModuleOptions = Partial<ModuleServiceInitializeOptions> & {
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
  /**
   * Options for the default Medusa Cloud Auth provider
   * @private
   */
  cloud?: MedusaCloudAuthProviderOptions
}

export interface MedusaCloudAuthProviderOptions {
  oauth_authorize_endpoint: string
  oauth_token_endpoint: string
  environment_handle: string
  sandbox_handle: string
  api_key: string
  callback_url: string
  disabled: boolean
}

declare module "@medusajs/types" {
  interface ModuleOptions {
    "@medusajs/auth": AuthModuleOptions
    "@medusajs/medusa/auth": AuthModuleOptions
  }
}
