import { Logger } from "../logger"
import { Constructor, MedusaContainer } from "./index"

export type ProviderLoaderOptions<TOptions = Record<string, unknown>> = {
  container: MedusaContainer
  options?: TOptions
  logger?: Logger
}

export type ModuleProviderExports = {
  services: Constructor<any>[]
  loaders?: ModuleProviderLoaderFunction[]
  runMigrations?(
    options: ProviderLoaderOptions<any>,
    moduleDeclaration?: any
  ): Promise<void>
  revertMigration?(
    options: ProviderLoaderOptions<any>,
    moduleDeclaration?: any
  ): Promise<void>
  generateMigration?(
    options: ProviderLoaderOptions<any>,
    moduleDeclaration?: any
  ): Promise<void>
  /**
   * Explicitly set the the true location of the module resources.
   * Can be used to re-export the module from a different location and specify its original location.
   */
  discoveryPath?: string
}

export type ModuleProviderLoaderFunction = (
  options: Record<string, any>,
  providerConfig?: any
) => Promise<void>

export type ModuleProvider = {
  resolve: string | ModuleProviderExports
  id: string
  options?: Record<string, unknown>
  is_default?: boolean
}
