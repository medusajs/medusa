import { ICachingModuleService } from "../caching"

/**
 * A relationship between two services in the remote joiner.
 */
export type JoinerRelationship = {
  /**
   * The alias used to reference this relationship.
   */
  alias: string
  /**
   * The foreign key field on the related service.
   */
  foreignKey: string
  /**
   * The primary key field on the current service.
   */
  primaryKey: string
  /**
   * The name of the related service.
   */
  serviceName: string
  /**
   * The entity name in the related service.
   */
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

/**
 * An alias configuration for a joiner service.
 */
export interface JoinerServiceConfigAlias {
  /**
   * The alias name or list of names for this service entry point.
   */
  name: string | string[]
  /**
   * The entity associated with this alias.
   */
  entity?: string
  /**
   * The fields that can be used to filter the results.
   */
  filterable?: string[]
  /**
   * Internal-only alias metadata used by the query layer.
   *
   * @internal
   */
  __internal?: {
    /**
     * Non-computed DML fields that can be used in cross-module SQL joins.
     * Used as an optimization layer to determine which fields are safe to
     * push into EXISTS-based cross-module filters.
     */
    crossjoinable?: string[]
  }
  /**
   * Extra arguments to pass to the remoteFetchData callback
   */
  args?: Record<string, any>
}

/**
 * The configuration of a service registered with the remote joiner.
 */
export interface JoinerServiceConfig {
  /**
   * The unique name of the service.
   */
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
  /**
   * The primary key fields of the service entity.
   */
  primaryKeys: string[]
  /**
   * The relationships this service has with other services.
   */
  relationships?: JoinerRelationship[]
  /**
   * Relationship extensions that augment another service's configuration.
   */
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

/**
 * An argument passed to a joiner query or expand.
 */
export interface JoinerArgument {
  /**
   * The name of the argument.
   */
  name: string
  /**
   * The value of the argument.
   */
  value?: any
}

/**
 * A directive applied to a field in a joiner query.
 */
export interface JoinerDirective {
  /**
   * The name of the directive.
   */
  name: string
  /**
   * The value associated with the directive.
   */
  value?: any
}

/**
 * A query object passed to the remote joiner to fetch and join data across services.
 */
export interface RemoteJoinerQuery {
  /**
   * The name of the service to query.
   */
  service?: string
  /**
   * The alias of the service entry point to query.
   */
  alias?: string
  /**
   * Nested relationship expansions to include in the query.
   */
  expands?: Array<{
    property: string
    fields: string[]
    args?: JoinerArgument[]
    directives?: { [field: string]: JoinerDirective[] }
  }>
  /**
   * The fields to retrieve from the queried service.
   */
  fields: string[]
  /**
   * Arguments to pass to the query.
   */
  args?: JoinerArgument[]
  /**
   * Directives to apply to the query fields.
   */
  directives?: { [field: string]: JoinerDirective[] }
}

/**
 * Options to configure the behavior of a remote joiner query execution.
 */
export interface RemoteJoinerOptions {
  /**
   * Whether to throw an error if a requested primary key is not found in the results.
   */
  throwIfKeyNotFound?: boolean
  /**
   * Whether to throw an error if a requested relationship cannot be resolved. Pass an array of relationship names to only throw for specific ones.
   */
  throwIfRelationNotFound?: boolean | string[]
  /**
   * Pre-fetched data to use as the initial dataset for the query instead of fetching from a service.
   */
  initialData?: object | object[]
  /**
   * When true, only the initial data is used and no additional service fetches are performed.
   */
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
