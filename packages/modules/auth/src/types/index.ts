import { ModuleProviderExports } from "@medusajs/types"
import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { Logger } from "@medusajs/types"

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
}
