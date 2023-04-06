import { Logger as _Logger } from "winston"
import { MedusaContainer } from "../common/medusa-container"
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

export type Logger = _Logger & {
  progress: (activityId: string, msg: string) => void
  info: (msg: string) => void
  warn: (msg: string) => void
}

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
}

export type ExternalModuleDeclaration = {
  scope: MODULE_SCOPE.EXTERNAL
  server: {
    type: "http"
    url: string
    keepAlive: boolean
  }
}

export type ModuleResolution = {
  resolutionPath: string | false
  definition: ModuleDefinition
  options?: Record<string, unknown>
  dependencies?: string[]
  moduleDeclaration?: InternalModuleDeclaration | ExternalModuleDeclaration
}

export type ModuleDefinition = {
  key: string
  registrationName: string
  defaultPackage: string | false
  label: string
  canOverride?: boolean
  isRequired?: boolean
  dependencies?: string[]
  defaultModuleDeclaration:
    | InternalModuleDeclaration
    | ExternalModuleDeclaration
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
