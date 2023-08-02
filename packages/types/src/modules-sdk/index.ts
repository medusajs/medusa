import { JoinerServiceConfig } from "../joiner"
import { Logger } from "../logger"
import { MedusaContainer } from "../common"
import { RepositoryService } from "../dal"

export type Constructor<T> = new (...args: any[]) => T
export * from "../common/medusa-container"

export type LogLevel =
  | "query"
  | "schema"
  | "error"
  | "warn"
  | "info"
  | "log"
  | "migration"
export type LoggerOptions = boolean | "all" | LogLevel[]

export enum MODULE_SCOPE {
  INTERNAL = "internal",
  EXTERNAL = "external",
}

export enum MODULE_RESOURCE_TYPE {
  SHARED = "shared",
  ISOLATED = "isolated",
}

export type InternalModuleDeclaration = {
  scope: MODULE_SCOPE.INTERNAL
  resources: MODULE_RESOURCE_TYPE
  dependencies?: string[]
  resolve?: string
  options?: Record<string, unknown>
  alias?: string // If multiple modules are registered with the same key, the alias can be used to differentiate them
  main?: boolean // If the module is the main module for the key when multiple ones are registered
}

export type ExternalModuleDeclaration = {
  scope: MODULE_SCOPE.EXTERNAL
  server?: {
    type: "http"
    url: string
    keepAlive: boolean
  }
  alias?: string // If multiple modules are registered with the same key, the alias can be used to differentiate them
  main?: boolean // If the module is the main module for the key when multiple ones are registered
}

export type ModuleResolution = {
  resolutionPath: string | false
  definition: ModuleDefinition
  options?: Record<string, unknown>
  dependencies?: string[]
  moduleDeclaration?: InternalModuleDeclaration | ExternalModuleDeclaration
  moduleExports?: ModuleExports
}

export type ModuleDefinition = {
  key: string
  registrationName: string
  defaultPackage: string | false
  label: string
  canOverride?: boolean
  isRequired?: boolean
  isQueryable?: boolean // If the modules should be queryable via Remote Joiner
  dependencies?: string[]
  defaultModuleDeclaration:
    | InternalModuleDeclaration
    | ExternalModuleDeclaration
}

export type LoadedModule = unknown & {
  __joinerConfig: JoinerServiceConfig
  __definition: ModuleDefinition
}

export type LoaderOptions<TOptions = Record<string, unknown>> = {
  container: MedusaContainer
  options?: TOptions
  logger?: Logger
}

export type ModuleLoaderFunction = (
  options: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
) => Promise<void>

export type ModulesResponse = {
  module: string
  resolution: string | false
}[]

export type ModuleExports = {
  service: Constructor<any>
  loaders?: ModuleLoaderFunction[]
  migrations?: any[]
  models?: Constructor<any>[]
  runMigrations?(
    options: LoaderOptions,
    moduleDeclaration?: InternalModuleDeclaration
  ): Promise<void>
  revertMigration?(
    options: LoaderOptions,
    moduleDeclaration?: InternalModuleDeclaration
  ): Promise<void>
}

export interface ModuleServiceInitializeOptions {
  database: {
    clientUrl: string
    schema?: string
    driverOptions?: Record<string, unknown>
    debug?: boolean
  }
}

export type ModuleServiceInitializeCustomDataLayerOptions = {
  manager?: any
  repositories?: { [key: string]: Constructor<RepositoryService> }
}
