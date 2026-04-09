import { ICachingModuleService } from "../caching"

export type JoinerRelationship = {
  alias: string
  foreignKey: string
  primaryKey: string
  serviceName: string
  entity?: string
  /**
   * In an inverted relationship the foreign key is on the other service and the primary key is on the current service
   */
  inverse?: boolean
  /**
   * Force the relationship to return a list
   */
  isList?: boolean
  /**
   * Extra arguments to pass to the remoteFetchData callback
   */
  args?: Record<string, any>
}

export type ComputedJoinerRelationship = JoinerRelationship & {
  primaryKeyArr: string[]
  foreignKeyArr: string[]
}

export interface JoinerServiceConfigAlias {
  name: string | string[]
  entity?: string
  filterable?: string[]
  /**
   * Extra arguments to pass to the remoteFetchData callback
   */
  args?: Record<string, any>
}

export interface JoinerServiceConfig {
  serviceName: string
  /**
   * Property name to use as entrypoint to the service
   */
  alias?: JoinerServiceConfigAlias | JoinerServiceConfigAlias[]
  /**
   * alias for deeper nested relationships (e.g. { 'price': 'prices.calculated_price_set.amount' })
   */
  fieldAlias?: Record<
    string,
    | string
    | {
        path: string
        forwardArgumentsOnPath: string[]
      }
  >
  primaryKeys: string[]
  relationships?: JoinerRelationship[]
  extends?: {
    serviceName: string
    entity?: string
    relationship: JoinerRelationship
  }[]
  /**
   * Extra arguments to pass to the remoteFetchData callback
   */
  args?: Record<string, any>
}

export interface JoinerArgument {
  name: string
  value?: any
}

export interface JoinerDirective {
  name: string
  value?: any
}

export interface RemoteJoinerQuery {
  service?: string
  alias?: string
  expands?: Array<{
    property: string
    fields: string[]
    args?: JoinerArgument[]
    directives?: { [field: string]: JoinerDirective[] }
  }>
  fields: string[]
  args?: JoinerArgument[]
  directives?: { [field: string]: JoinerDirective[] }
}

export interface RemoteJoinerOptions {
  throwIfKeyNotFound?: boolean
  throwIfRelationNotFound?: boolean | string[]
  initialData?: object | object[]
  initialDataOnly?: boolean
  /**
   * The locale to use for the query.
   * Translation will be applied to the query result based on the locale.
   */
  locale?: string
  cache?: {
    /**
     * Whether to enable the cache. This is only useful if you want to enable without providing any
     * other options or if you want to enable/disable the cache based on the arguments.
     */
    enable?: boolean | ((args: any[]) => boolean | undefined)
    /**
     * The key to use for the cache.
     * If a function is provided, it will be called with the arguments as the first argument and the
     * container as the second argument.
     */
    key?:
      | string
      | ((
          args: any[],
          cachingModule: ICachingModuleService
        ) => string | Promise<string>)
    /**
     * The tags to use for the cache.
     */
    tags?: string[] | ((args: any[]) => string[] | undefined)
    /**
     * The time-to-live (TTL) value in seconds.
     */
    ttl?: number | ((args: any[]) => number | undefined)
    /**
     * Whether to auto invalidate the cache whenever it is possible.
     */
    autoInvalidate?: boolean | ((args: any[]) => boolean | undefined)
    /**
     * The providers to use for the cache.
     */
    providers?: string[] | ((args: any[]) => string[] | undefined)
  }
}

export interface RemoteNestedExpands {
  [key: string]: {
    fields?: string[]
    args?: JoinerArgument[]
    expands?: RemoteNestedExpands
  }
}

export type InternalJoinerServiceConfig = Omit<
  JoinerServiceConfig,
  "relationships"
> & {
  relationships?: Map<string, JoinerRelationship | JoinerRelationship[]>
  entity?: string
}

export type ExecutionStage = {
  service: string
  entity?: string
  paths: string[]
  depth: number
}

export interface RemoteExpandProperty {
  executionStages?: ExecutionStage[][]
  property: string
  parent: string
  parentConfig?: InternalJoinerServiceConfig
  serviceConfig: InternalJoinerServiceConfig
  entity?: string
  fields?: string[]
  args?: JoinerArgument[]
  expands?: RemoteNestedExpands
}
