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

export interface JoinerServiceConfigAlias {
  name: string | string[]
  entity?: string
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
