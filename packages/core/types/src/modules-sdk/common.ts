import {
  JoinerRelationship,
  JoinerServiceConfig,
  RemoteJoinerOptions,
  RemoteJoinerQuery,
} from "../joiner"

import { MedusaContainer } from "../common"
import { RepositoryService } from "../dal"
import { Logger } from "../logger"

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

export type CustomModuleDefinition = {
  key?: string
  registrationName?: string
  label?: string
  isQueryable?: boolean // If the module is queryable via Remote Joiner
  dependencies?: string[]
}

export type InternalModuleDeclaration = {
  scope: "internal"
  resources: "shared" | "isolated"
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
  server:
    | {
        type: "http"
        /*
        Base URL of the module. 
        */
        url: string
        keepAlive?: boolean
        keepAliveTimeout?: number
        options?: Record<string, unknown>
      }
    | {
        type: "grpc"
        url: string
        options?: Record<string, unknown>
      }
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
  isRequired?: boolean
  isQueryable?: boolean // If the module is queryable via Remote Joiner
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

type ExtraFieldType =
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
    extraFields?: Record<
      string,
      {
        type: ExtraFieldType
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
  runMigrations?(
    options: LoaderOptions<any>,
    moduleDeclaration?: InternalModuleDeclaration
  ): Promise<void>
  revertMigration?(
    options: LoaderOptions<any>,
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

export type RemoteQueryFunction = (
  query: string | RemoteJoinerQuery | object,
  variables?: Record<string, unknown>,
  options?: RemoteJoinerOptions
) => Promise<any> | null

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
