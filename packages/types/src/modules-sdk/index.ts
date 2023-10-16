import { JoinerRelationship, JoinerServiceConfig, RemoteJoinerQuery } from "../joiner"

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
  definition?: ModuleDefinition // That represent the definition of the module, such as the one we have for the medusa supported modules. This property is used for custom made modules.
  resolve?: string
  options?: Record<string, unknown>
  /**
   * If multiple modules are registered with the same key, the alias can be used to differentiate them
   */
  alias?: string
  /**
   * If the module is the main module for the key when multiple ones are registered
   */
  main?: boolean
}

export type ExternalModuleDeclaration = {
  scope: MODULE_SCOPE.EXTERNAL
  definition?: ModuleDefinition // That represent the definition of the module, such as the one we have for the medusa supported modules. This property is used for custom made modules.
  server?: {
    type: "http"
    url: string
    keepAlive: boolean
  }
  options?: Record<string, unknown>
  /**
   * If multiple modules are registered with the same key, the alias can be used to differentiate them
   */
  alias?: string
  /**
   * If the module is the main module for the key when multiple ones are registered
   */
  main?: boolean
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
  /**
   * @deprecated property will be removed in future versions
   */
  canOverride?: boolean
  /**
   * @deprecated property will be removed in future versions
   */
  isRequired?: boolean
  isQueryable?: boolean // If the module is queryable via Remote Joiner
  isLegacy?: boolean // If the module is a legacy module TODO: Remove once all the legacy modules are migrated
  dependencies?: string[]
  defaultModuleDeclaration:
    | InternalModuleDeclaration
    | ExternalModuleDeclaration
}

export type LinkModuleDefinition = {
  key: string
  registrationName: string
  label: string
  dependencies?: string[]
  defaultModuleDeclaration: InternalModuleDeclaration
}

type ModuleDeclaration = ExternalModuleDeclaration | InternalModuleDeclaration
export type ModuleConfig = ModuleDeclaration & {
  module: string
  path: string
  definition: ModuleDefinition
}

export type LoadedModule = unknown & {
  __joinerConfig: ModuleJoinerConfig
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

export type ModuleJoinerConfig = Omit<
  JoinerServiceConfig,
  "serviceName" | "primaryKeys" | "relationships" | "extends"
> & {
  /**
   * GraphQL schema for the all module's available entities and fields
   */
  schema?: string
  relationships?: ModuleJoinerRelationship[]
  extends?: {
    serviceName: string
    fieldAlias?: Record<
      string,
      | string
      | {
          path: string
          forwardArgumentsOnPath: string[]
        }
    > // alias for deeper nested relationships (e.g. { 'price': 'prices.calculated_price_set.amount' })
    relationship: ModuleJoinerRelationship
  }[]
  serviceName?: string
  primaryKeys?: string[]
  /**
   * If the module is a link module
   */
  isLink?: boolean
  /**
   * Keys that can be used to link to other modules. e.g { product_id: "Product" } "Product" being the entity it refers to
   */
  linkableKeys?: Record<string, string>
  /**
   * If true it expands a RemoteQuery property but doesn't create a pivot table
   */
  isReadOnlyLink?: boolean
  databaseConfig?: {
    /**
     * Name of the pivot table. If not provided it is auto generated
     */
    tableName?: string
    /**
     * Prefix for the id column. If not provided it is "link"
     */
    idPrefix?: string
    extraFields?: Record<
      string,
      {
        type:
          | "date"
          | "time"
          | "datetime"
          | "bigint"
          | "blob"
          | "uint8array"
          | "array"
          | "enumArray"
          | "enum"
          | "json"
          | "integer"
          | "smallint"
          | "tinyint"
          | "mediumint"
          | "float"
          | "double"
          | "boolean"
          | "decimal"
          | "string"
          | "uuid"
          | "text"
        defaultValue?: string
        nullable?: boolean
        /**
         * Mikro-orm options for the column
         */
        options?: Record<string, unknown>
      }
    >
  }
}

export declare type ModuleJoinerRelationship = JoinerRelationship & {
  /**
   * If true, the relationship is an internal service from the medusa core TODO: Remove when there are no more "internal" services
   */
  isInternalService?: boolean
  /**
   * If true, the link joiner will cascade deleting the relationship
   */
  deleteCascade?: boolean
}

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
    /**
     * Forces to use a shared knex connection
     */
    connection?: any
    clientUrl?: string
    schema?: string
    host?: string
    port?: number
    user?: string
    password?: string
    database?: string
    driverOptions?: Record<string, unknown>
    debug?: boolean
    pool?: Record<string, unknown>
  }
}

export type ModuleServiceInitializeCustomDataLayerOptions = {
  manager?: any
  repositories?: {
    [key: string]: Constructor<RepositoryService>
  }
}

export type RemoteQueryFunction = (
  query: string | RemoteJoinerQuery | object,
  variables?: Record<string, unknown>
) => Promise<any> | null