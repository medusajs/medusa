import {
  CrossModuleJoinSpec,
  JoinerArgument,
  JoinerRelationship,
  JoinerServiceConfig,
  ModuleJoinerConfig,
  RemoteJoinerOptions,
  RemoteJoinerQuery,
} from "@medusajs/types"

// Sentinel path used as the root key in expand maps.
export const BASE_PATH = "_root"

export type RelationMap = Map<string, Map<string, string>>

// Relationship with pre-split key arrays used during join execution.
export type ComputedJoinerRelationship = JoinerRelationship & {
  primaryKeyArr: string[]
  foreignKeyArr: string[]
}

// Service config after catalog indexing (relationships as a Map).
export type InternalJoinerServiceConfig = Omit<
  JoinerServiceConfig,
  "relationships"
> & {
  relationships?: Map<string, JoinerRelationship | JoinerRelationship[]>
  entity?: string
  entryPoint?: string
  isLink?: boolean
  databaseConfig?: ModuleJoinerConfig["databaseConfig"]
  databaseClientUrl?: string
}

/**
 * A cross-module filter that could not be pushed down to SQL during
 * compilation. Kept on the plan so the in-memory filtering stage (stage 2)
 * can complete it.
 */
export type ResidualCrossModuleFilter = {
  /** Dotted relation path relative to the query root, in alias form. */
  path: string
  filters: Record<string, unknown>
}

/**
 * A property that was loaded solely to evaluate residual cross-module filters
 * in memory. Hidden from the returned payload after evaluation.
 */
export type ResidualHiddenProperty = {
  /** Alias-form path to the parent objects holding the property. */
  location: string[]
  property: string
}

/**
 * One root ordering key applied in memory (stage 2). When any key cannot be
 * pushed down to SQL, the whole ordering moves in memory in this order.
 */
export type ResidualOrderBy = {
  /** Alias-form path from the query root, including the sorted field. */
  segments: string[]
  direction: "ASC" | "DESC"
}

/**
 * Nested expand tree attached to a fetch node so a single module call can
 * load same-service relations in one round-trip.
 *
 * Consumed by {@link IRemoteDataFetcher} / ModuleDataFetcher.
 */
export interface RemoteNestedExpands {
  [key: string]: {
    fields?: string[]
    args?: JoinerArgument[]
    expands?: RemoteNestedExpands
  }
}

/**
 * One node in the expand/fetch graph. Also the payload passed to
 * {@link IRemoteDataFetcher.fetch}.
 */
export interface RemoteExpandProperty {
  /** Depth-batched fetch groups; set on the root node only. */
  executionStages?: ExecutionStage[][]
  property: string
  parent: string
  parentConfig?: InternalJoinerServiceConfig
  serviceConfig: InternalJoinerServiceConfig
  entity?: string
  fields?: string[]
  args?: JoinerArgument[]
  expands?: RemoteNestedExpands
  /** True when this node was synthesized from a fieldAlias rewrite. */
  isAliasMapping?: boolean
}

export type ExecutionStage = {
  service: string
  entity?: string
  paths: string[]
  depth: number
}

/**
 * Records a fieldAlias that must be collapsed onto its short name after joins.
 *
 * `path` is the full real path from the query root (excluding BASE_PATH).
 * `location` is the path to the parent object that should receive the short name.
 */
export type ShortcutSpec = {
  location: string[]
  property: string
  path: string[]
  isList?: boolean
}

/**
 * Compiled query ready for execution.
 */
export type QueryPlan = {
  root: RemoteExpandProperty
  /**
   * Expand map after same-service grouping. Keys are dotted paths starting
   * with BASE_PATH. The root entry holds `executionStages`.
   */
  expands: Map<string, RemoteExpandProperty>
  shortcuts: ShortcutSpec[]
  pkName: string
  primaryKeyArg?: { name: string; value?: any }
  otherArgs?: { name: string; value?: any }[]
  initialData: any[]
  initialDataOnly?: boolean
  options?: RemoteJoinerOptions
  /**
   * Cross-module joins pushed down to the root module fetch. Applied as
   * correlated EXISTS/scalar subqueries by the module's DAL.
   */
  crossModuleJoins?: CrossModuleJoinSpec[]
  /**
   * Cross-module filters that could not be pushed down to SQL. Completed in
   * memory by executePlan after the fetch (stage 2).
   */
  residualCrossModuleFilters?: ResidualCrossModuleFilter[]
  /**
   * Properties added to the query solely to evaluate residual filters,
   * hidden from the returned payload.
   */
  residualHiddenProperties?: ResidualHiddenProperty[]
  /**
   * Root ordering applied in memory after the fetch because at least one sort
   * key could not be pushed down to SQL.
   */
  residualOrderBy?: ResidualOrderBy[]
}

/** Contract for loading module data during join execution. */
export interface IRemoteDataFetcher {
  fetch(
    expand: RemoteExpandProperty,
    keyField: string,
    ids?: (unknown | unknown[])[],
    relationship?: JoinerRelationship
  ): Promise<{
    data: unknown[] | { [path: string]: unknown }
    path?: string
  }>
}

export type CompileInput = {
  query: RemoteJoinerQuery
  serviceConfig: InternalJoinerServiceConfig
  options?: RemoteJoinerOptions
  initialData: any[]
}
