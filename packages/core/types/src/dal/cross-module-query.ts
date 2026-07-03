import { FilterQuery } from "./utils"

/**
 * Describes a link table connecting the queried root entity to an external table.
 *
 * @internal
 */
export type CrossModuleJoinLink = {
  /**
   * PostgreSQL schema for the link table. Defaults to `public`.
   */
  schema?: string
  /**
   * Link table name.
   */
  table: string
  /**
   * Column on the link table referencing the correlation source — the queried
   * root entity when there is no `parent`, otherwise the parent join's target row.
   */
  sourceKey: string
  /**
   * Column on the link table referencing the external entity.
   */
  targetKey: string
}

/**
 * Describes an external table that can be filtered or sorted against.
 *
 * @internal
 */
export type CrossModuleJoinTarget = {
  /**
   * PostgreSQL schema for the target table. Defaults to `public`.
   */
  schema?: string
  /**
   * Target table name.
   */
  table: string
  /**
   * Primary key column on the target table. Defaults to `id`.
   */
  primaryKey?: string
  /**
   * Filters applied to the target table.
   */
  filters?: FilterQuery<any>
}

/**
 * Metadata describing how to join and filter/sort against a table outside the module.
 *
 * The join is translated into a correlated `EXISTS` subquery (for filtering)
 * and/or a correlated scalar subquery (for sorting) against the root query,
 * so the root rows are never multiplied and counts stay accurate.
 *
 * Target table aliases match `target.table` directly (e.g. `product.handle`
 * for `target.table: "product"`).
 *
 * Behaviour callers should know about:
 * - Filtering/sorting is executed as hand-built SQL against the target table.
 *   Beyond the soft-delete guards below, no other MikroORM global filters
 *   registered on the target entity are applied automatically (the target
 *   lives in another module and is not a registered entity here). Any extra
 *   scoping a module needs must be encoded into `target.filters`.
 * - Soft-delete guards mirror the root query: soft-deleted links and targets
 *   are excluded unless the query runs with `withDeleted`, in which case
 *   they are included too.
 * - Multiple independent targets are combined with AND by supplying several
 *   top-level join specs (each without a `parent`).
 * - Multi-hop filters chain joins through `parent`, correlating a join to a
 *   parent target row rather than the root entity (e.g. customer -> tier ->
 *   functionality). Chains can nest recursively to any depth. `parent` must
 *   reference the parent join's `target.table`.
 * - Each join must target a unique table within a single query.
 * - Correlation uses a single primary key column; composite keys are not
 *   supported.
 *
 * @example
 * ```ts
 * {
 *   link: {
 *     table: "customer_api_key",
 *     sourceKey: "api_key_id",
 *     targetKey: "customer_id",
 *   },
 *   target: {
 *     table: "customer",
 *     filters: { email: "user@example.com" },
 *   },
 * }
 * ```
 *
 * @internal
 */
export type CrossModuleJoinSpec = {
  /**
   * When set, this join is correlated to the target row of the parent join
   * instead of the root entity. The value must match the parent join's
   * `target.table`. Used for multi-hop filters such as filtering orders by a
   * product's sales channel.
   */
  parent?: string
  link: CrossModuleJoinLink
  target: CrossModuleJoinTarget
}

/**
 * Internal-only query options passed through the DAL layer.
 *
 * @internal
 */
export type InternalQueryOptions = {
  /**
   * Cross-module join specifications that allows the graph layer to optimize data fetching.
   * The logic behind what gets passed here is owned by the graph layer, and that layer will ensure
   * we don't break boundaries between modules other than for performance optimizations.
   */
  crossModuleJoins?: CrossModuleJoinSpec[]
}
