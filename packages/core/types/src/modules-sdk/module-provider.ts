import { Logger } from "../logger"
import {
  Constructor,
  InternalModuleDeclaration,
  MedusaContainer,
} from "./index"

export type ProviderLoaderOptions<TOptions = Record<string, unknown>> = {
  container: MedusaContainer
  options?: TOptions
  logger?: Logger
  moduleOptions: Record<string, unknown>
}

export type ModuleProviderExports<Service = any> = {
  module?: string
  services: Constructor<Service>[]
  loaders?: ModuleProviderLoaderFunction[]
  /**
   * The licensed feature handle covering this provider. When set, the
   * provider only loads when the license key in the environment covers the
   * feature. The value must equal the feature handle encoded in the license
   * key's `features` claim.
   */
  licensedFeature?: string
  runMigrations?(
    options: ProviderLoaderOptions<Service>,
    moduleDeclaration?: any
  ): Promise<void>
  revertMigration?(
    options: ProviderLoaderOptions<Service>,
    moduleDeclaration?: any
  ): Promise<void>
  generateMigration?(
    options: ProviderLoaderOptions<Service>,
    moduleDeclaration?: any
  ): Promise<void>
  /**
   * Explicitly set the true location of the module resources.
   * Can be used to re-export the module from a different location and specify its original location.
   */
  discoveryPath?: string
}

export type ModuleProviderLoaderFunction = (
  options: ProviderLoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
) => Promise<void>

export type ModuleProvider = {
  resolve: string | ModuleProviderExports<any>
  id?: string
  options?: Record<string, unknown>
  is_default?: boolean
}
