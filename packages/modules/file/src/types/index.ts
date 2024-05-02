import {
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@medusajs/types"

export const FileProviderIdentifierRegistrationName =
  "file_providers_identifier"

export const FileProviderRegistrationPrefix = "fs_"

export type FileModuleOptions = Partial<ModuleServiceInitializeOptions> & {
  /**
   * Providers to be registered
   */
  provider?: {
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
  }
}
