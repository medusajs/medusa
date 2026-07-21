import { ICachingModuleService } from "../caching"

/**
 * Defines a relationship between two services in the Joiner.
 */
export type JoinerRelationship = {
  /**
   * The alias used to reference the related service in queries.
   */
  alias: string
  /**
   * The foreign key field on the related service used to join the relationship.
   */
  foreignKey: string
  /**
   * The primary key field on the current service used to join the relationship.
   */
  primaryKey: string
  /**
   * The name of the related service.
   */
  serviceName: string
  /**
   * The entity name within the related service.
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
 * Alias configuration for a joiner service entry point.
 */
export interface JoinerServiceConfigAlias {
  /**
   * The alias name or list of alias names for the service entry point.
   */
  name: string | string[]
  /**
   * The entity name associated with this alias.
   */
  entity?: string
  /**
   * The list of fields that can be used as filters when querying through this alias.
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
    /**
     * Physical table name (without PG schema) backing the alias entity.
     * Required to build cross-module SQL joins against the entity's table.
     */
    tableName?: string
    /**
     * PG schema of the entity's table, when the DML definition specifies one.
     */
    schema?: string
    /**
     * Module-internal DML relations of the alias entity, keyed by property
     * name. Used to traverse own-model hops when building cross-module SQL
     * joins (e.g. cart -> items -> product).
     */
    relations?: Record<
      string,
      {
        /**
         * Entity the relation points to.
         */
        entity: string
        /**
         * Join column name.
         */
        foreignKey: string
        /**
         * Which side of the relation holds the foreign key column: `self`
         * for belongsTo, `target` for hasMany.
         */
        foreignKeyOwner: "self" | "target"
        isList?: boolean
      }
    >
  }
  /**
   * Extra arguments to pass to the remoteFetchData callback
   */
  args?: Record<string, any>
}

/**
 * Configuration for a service registered with the Joiner.
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
   * The primary key fields used to identify records in this service.
   */
  primaryKeys: string[]
  /**
   * The relationships this service has with other services.
   */
  relationships?: JoinerRelationship[]
  /**
   * Relationship extensions that this service adds to other services.
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
 * An argument passed to a joiner query.
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
   * The value of the directive.
   */
  value?: any
}

/**
 * A query object used by the remote joiner to fetch and join data across services.
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
   * Nested relationships to expand in the query result.
   */
  expands?: Array<{
    /**
     * The property path to the relationship to expand.
     */
    property: string
    /**
     * The fields to retrieve for the expanded relationship.
     */
    fields: string[]
    /**
     * Arguments to pass to the expanded relationship query.
     */
    args?: JoinerArgument[]
    /**
     * Directives to apply to fields in the expanded relationship.
     */
    directives?: { [field: string]: JoinerDirective[] }
  }>
  /**
   * The fields to retrieve from the queried service.
   */
  fields: string[]
  /**
   * Arguments to pass to the service query.
   */
  args?: JoinerArgument[]
  /**
   * Directives to apply to fields in the query.
   */
  directives?: { [field: string]: JoinerDirective[] }
}

/**
 * Options controlling the behavior of a remote joiner query execution.
 */
export interface RemoteJoinerOptions {
  /**
   * Whether to throw an error if a requested key is not found in the result.
   */
  throwIfKeyNotFound?: boolean
  /**
   * Whether to throw an error if a requested relation is not found, or a list of relation names to check.
   */
  throwIfRelationNotFound?: boolean | string[]
  /**
   * Initial data to use as the starting dataset for the query instead of fetching from a service.
   */
  initialData?: object | object[]
  /**
   * Whether to use only the initial data without fetching additional data from services.
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
