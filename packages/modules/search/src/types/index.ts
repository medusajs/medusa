import {
  Logger,
  MedusaContainer,
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
  ModulesSdkTypes,
  SearchTypes,
} from "@medusajs/framework/types"

export const SearchProviderIdentifiersRegistrationName =
  "search_providers_identifier"

// Providers are registered as `srh_{identifier}_{id}`.
export const SearchProviderRegistrationPrefix = "srh_"

export type SearchModuleOptions = Partial<ModuleServiceInitializeOptions> & {
  /**
   * More than one may be registered, unlike most provider-backed modules. A
   * definition picks one by identifier through its `provider`, so products can
   * live on a dedicated engine while quieter entities stay on Postgres.
   */
  providers?: {
    resolve: string | ModuleProviderExports
    id: string
    options?: Record<string, unknown>
  }[]

  // For definitions that name no provider. Defaults to the only registered one,
  // and is required when there is more than one.
  default_provider?: string

  // Prepended to every physical index name, for tenant-shared engines.
  index_prefix?: string

  /**
   * The definitions this module manages. It does not discover them itself — the
   * application loads them off the file system and passes them in, so there is one
   * input rather than two that can disagree.
   */
  indexes?: SearchTypes.SearchIndexDefinition[]

  reindex?: {
    // Documents written to the engine per request.
    // @default 100
    batch_size?: number
  }
}

declare module "@medusajs/types" {
  interface ModuleOptions {
    "@medusajs/search": SearchModuleOptions
    "@medusajs/medusa/search": SearchModuleOptions
  }
}

/**
 * Handed to the migration and seeding helpers per call; they keep no state of
 * their own. `indexes` is a live reference to the service's registry, not a copy,
 * and `providers` is structural so `utils` need not depend on the service layer.
 */
/** Resolved definitions, keyed by index name. */
export type SearchIndexes = Map<
  string,
  SearchTypes.ResolvedSearchIndexDefinition
>

export type SearchIndexContext = {
  // Handed to a definition's `seed` so it can reach `query.graph`.
  container: MedusaContainer
  logger: Logger
  options: SearchModuleOptions
  indexes: SearchIndexes
  providers: { retrieve(identifier: string): SearchTypes.ISearchProvider }
  indexService: ModulesSdkTypes.IMedusaInternalService<any>
  syncService: ModulesSdkTypes.IMedusaInternalService<any>
  // The Locking Module, when registered. Absent in tests, where work goes
  // unserialized.
  locking?: {
    execute<T>(
      keys: string | string[],
      job: () => Promise<T>,
      args?: { timeout?: number }
    ): Promise<T>
  }
}

// Enough to resolve a definition and read its record — all the planners need.
export type SearchIndexRegistry = Pick<
  SearchIndexContext,
  "indexes" | "indexService" | "providers"
>

// What running a seed adds: the sync history it writes, the batch size, and the
// container `seed` reads through.
export type SearchSeedRuntime = SearchIndexRegistry &
  Pick<SearchIndexContext, "syncService" | "container" | "options">

/* ---------------------------- persisted records ---------------------------- */

/**
 * A row of the module's own bookkeeping. Internal on purpose — not on
 * `SearchTypes`, and the models are registered for neither CRUD nor linking.
 */
export type SearchIndexRecord = {
  id: string
  name: string
  provider: string
  status: string
  definition_hash: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

/** One seed run against one index. Append-only, so these are the history. */
export type SearchIndexSyncRecord = {
  id: string
  search_index_id: string
  job_id: string | null
  status: string
  filters: Record<string, unknown> | null
  last_key: string | null
  documents_synced: number
  started_at: Date | null
  completed_at: Date | null
  error: string | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

/* ------------------------- migration and seed plans ------------------------ */

/**
 * A step in bringing the physical indexes in line with the loaded definitions.
 *
 * Planned and executed separately, like link migrations, so that `db:migrate`
 * can show what it is about to do. Every action is idempotent: running the plan
 * twice, or running it at startup after `db:migrate` already did, is a no-op.
 */
export type SearchIndexMigrationAction =
  | {
      /**
       * The index does not exist yet. Nothing is serving it, so it is built
       * directly under its live name and filled in place.
       */
      action: "create"
      index: string
      physical_name: string
      definition_hash: string
    }
  | {
      /**
       * The definition changed. Only the build happens here; filling the result
       * and putting it in front of reads happens at application start.
       *
       * On a provider with `swapIndex`, the new schema is built alongside the
       * live index and aliased over once seeded, so reads never see a half-built
       * index. Without one there is nowhere to build, so the live index is
       * replaced in place and holds nothing until the seed runs — which
       * `physical_name === live_physical_name` is the signal for.
       */
      action: "migrate"
      /** The index being built. Derived from `definition_hash` when swapping. */
      physical_name: string
      /** The index serving reads now. */
      live_physical_name: string
      index: string
      definition_hash: string
      live_definition_hash: string
    }
  | {
      action: "noop"
      index: string
      physical_name: string
      definition_hash: string
    }

export type SearchIndexSeedReason =
  /** Created but never filled. */
  | "index_created"
  /** Exists and holds no documents — an engine wiped or restarted underneath us. */
  | "index_empty"
  /** A migration built a new index that has to be filled, then swapped in. */
  | "schema_changed"
  | "last_run_failed"

export type SearchIndexSeedAction = {
  index: string
  /** The index the seed writes into. */
  target_physical_name: string
  /** Whether the target has to be aliased over the live index once filled. */
  swap: boolean
  reason: SearchIndexSeedReason
}
