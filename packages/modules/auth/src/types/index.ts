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
    options: {
      /**
       * key value pair of the provider name and the configuration to be passed to the provider constructor
       */
      config: Record<string, unknown>
    }
  }[]
}
