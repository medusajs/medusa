import { JoinerRelationship, JoinerServiceConfig } from "../joiner"

import { MedusaContainer } from "../common"
import { RepositoryService } from "../dal"
import { Logger } from "../logger"
import { ModuleProviderExports } from "./module-provider"
import {
  RemoteQueryGraph,
  RemoteQueryInput,
  RemoteQueryObjectConfig,
  RemoteQueryObjectFromStringResult,
} from "./remote-query-object-from-string"

export {
  RemoteQueryGraph,
  RemoteQueryInput,
  RemoteQueryObjectConfig,
  RemoteQueryObjectFromStringResult,
}

export type Constructor<T> = new (...args: any[]) => T | (new () => T)

export * from "../common/medusa-container"
export * from "./medusa-internal-service"
export * from "./module-provider"
export * from "./remote-query"
export * from "./remote-query-entry-points"
export * from "./to-remote-query"

export type LogLevel =
  | "query"
  | "schema"
  | "error"
  | "warn"
  | "info"
  | "log"
  | "migration"
export type LoggerOptions = boolean | "all" | LogLevel[]

export type CustomModuleDefinition = {
  key?: string
  label?: string
  isQueryable?: boolean // If the module is queryable via Remote Joiner
  dependencies?: string[]
}

export type InternalModuleDeclaration = {
  scope: "internal"
  dependencies?: string[]
  definition?: CustomModuleDefinition // That represent the definition of the module, such as the one we have for the medusa supported modules. This property is used for custom made modules.
  resolve?: string | ModuleExports
  options?: Record<string, unknown>
  /**
   * If multiple modules are registered with the same key, the alias can be used to differentiate them
   */
  alias?: string
  /**
   * If the module is the main module for the key when multiple ones are registered
   */
  main?: boolean
  worker_mode?: "shared" | "worker" | "server"
}

export type ExternalModuleDeclaration = {
  scope: "external"
  definition?: CustomModuleDefinition // That represent the definition of the module, such as the one we have for the medusa supported modules. This property is used for custom made modules.
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
  moduleExports?: ModuleExports | ModuleProviderExports
}

export type ModuleDefinition = {
  key: string
  defaultPackage: string | false
  label: string
  isRequired?: boolean
  isQueryable?: boolean // If the module is queryable via Remote Joiner
  dependencies?: string[]
  /** @internal only used in exceptional cases - relying on the shared contrainer breaks encapsulation */
  __passSharedContainer?: boolean
  defaultModuleDeclaration:
    | InternalModuleDeclaration
    | ExternalModuleDeclaration
}

export type LinkModuleDefinition = {
  key: string
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
  dataLoaderOnly?: boolean
}

export type ModuleLoaderFunction = (
  options: LoaderOptions<any>,
  moduleDeclaration?: InternalModuleDeclaration
) => Promise<void>

export type ModulesResponse = {
  module: string
  resolution: string | false
}[]

export type LinkModulesExtraFields = Record<
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

/**
 * A link for two records of linked data models.
 *
 * The keys are the names of each module, and their value is an object that holds the ID of the linked data model's record.
 */
export type LinkDefinition = {
  [moduleName: string]: {
    // TODO: changing this to any temporarily as the "data" attribute is not being picked up correctly
    [fieldName: string]: any
  }
} & {
  data?: Record<string, unknown>
}

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
          forwardArgumentsOnPath?: string[]
          isList?: boolean
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
  /**
   * Fields that will be part of the link record aside from the primary keys that can be updated
   * If not explicitly defined, this array will be populated by databaseConfig.extraFields
   */
  extraDataFields?: string[]
  databaseConfig?: {
    /**
     * Name of the pivot table. If not provided it is auto generated
     */
    tableName?: string
    /**
     * Prefix for the id column. If not provided it is "link"
     */
    idPrefix?: string
    extraFields?: LinkModulesExtraFields
  }
}

export declare type ModuleJoinerRelationship = JoinerRelationship & {
  /**
   * If true, the link joiner will cascade deleting the relationship
   */
  deleteCascade?: boolean
}

export type ModuleExports<T = Constructor<any>> = {
  service: T
  loaders?: ModuleLoaderFunction[]
  runMigrations?(
    options: LoaderOptions<any>,
    moduleDeclaration?: InternalModuleDeclaration
  ): Promise<void>
  revertMigration?(
    options: LoaderOptions<any>,
    moduleDeclaration?: InternalModuleDeclaration
  ): Promise<void>
  generateMigration?(
    options: LoaderOptions<any>,
    moduleDeclaration?: InternalModuleDeclaration
  ): Promise<void>
  /**
   * Explicitly set the the true location of the module resources.
   * Can be used to re-export the module from a different location and specify its original location.
   */
  discoveryPath?: string
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
    driverOptions?: Record<string, unknown> & {
      connection?: Record<string, unknown>
    }
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

export type ModuleBootstrapDeclaration =
  | InternalModuleDeclaration
  | ExternalModuleDeclaration
// TODO: These should be added back when the chain of types are fixed
// | ModuleServiceInitializeOptions
// | ModuleServiceInitializeCustomDataLayerOptions

export interface IModuleService {
  /**
   * @ignore
   */
  __joinerConfig?(): ModuleJoinerConfig

  /**
   * @ignore
   */
  __hooks?: {
    onApplicationStart?: () => Promise<void>
    onApplicationShutdown?: () => Promise<void>
    onApplicationPrepareShutdown?: () => Promise<void>
  }
}
