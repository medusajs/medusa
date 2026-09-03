import {
  Logger,
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

  /**
   * Medusa Cloud search. When set, the module registers the built-in
   * `search-medusa` provider automatically — same pattern as payment `cloud`
   * and notification `cloud` email.
   */
  cloud?: {
    api_key: string
    endpoint: string
    environment_handle: string
  }

  // For definitions that name no provider. Defaults to the only registered one,
  // and is required when there is more than one.
  default_provider?: string

  // Prepended to every physical index name, for tenant-shared engines.
  index_prefix?: string

  /**
   * The definitions this module manages. It does not discover them itself — the
   * application loads them off the file system and passes them in, so there is one
   * input rather than two that can disagree. Already normalized: DSL field
   * schemas are compiled to plain definitions by `defineSearchIndex`, so the
   * module never sees them.
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

/** The physical index and provider currently serving reads for a logical index. */
export type SearchActiveIndexVersion = {
  physical_name: string
  provider: string
  version: number
}

// A raw connection to the module's own Postgres schema, same container key
// `search-postgres` receives — nothing here is modeled.
export type SearchDbManager = {
  execute(sql: string, params?: unknown[]): Promise<any[]>
}

export type SearchIndexContext = {
  container: SearchTypes.SearchContainer
  logger: Logger
  options: SearchModuleOptions
  indexes: SearchIndexes
  providers: { retrieve(identifier: string): SearchTypes.ISearchProvider }
  indexService: ModulesSdkTypes.IMedusaInternalService<any>
  versionService: ModulesSdkTypes.IMedusaInternalService<any>
  syncService: ModulesSdkTypes.IMedusaInternalService<any>
  manager: SearchDbManager
  // The Locking Module, when registered. Absent in tests, where work goes
  // unserialized.
  locking?: {
    execute<T>(
      keys: string | string[],
      job: () => Promise<T>,
      args?: { timeout?: number }
    ): Promise<T>
  }
  // Which physical index is active, and which (if any) is being built.
  // `setActive`/`setBuilding` update this process' own view immediately.
  activeVersionCache?: {
    get(name: string): Promise<SearchActiveIndexVersion>
    getBuilding(name: string): Promise<SearchActiveIndexVersion | undefined>
    setActive(name: string, value: SearchActiveIndexVersion): void
    setBuilding(name: string, value: SearchActiveIndexVersion | undefined): void
  }
}

// Enough to resolve a definition and read its record — all the planners need.
export type SearchIndexRegistry = Pick<
  SearchIndexContext,
  "indexes" | "indexService" | "versionService" | "providers" | "logger"
>

// What running a seed adds: the sync history it writes, the batch size, and the
// container `seed` reads through.
export type SearchSeedRuntime = SearchIndexRegistry &
  Pick<
    SearchIndexContext,
    "syncService" | "container" | "options" | "activeVersionCache" | "manager"
  >

// Ingestion writes straight through, so unlike a seed it keeps no sync history.
export type SearchIngestionRuntime = SearchIndexRegistry &
  Pick<SearchIndexContext, "container" | "activeVersionCache" | "manager">

/** Event name to the indexes that declared it. */
export type SearchEventRoutes = Map<string, string[]>

/* ---------------------------- persisted records ---------------------------- */

/** The logical index and which of its versions currently serves reads. */
export type SearchIndexRecord = {
  id: string
  name: string
  active_version: number | null
}

/** One physical index ever built for a logical index. */
export type SearchIndexVersionRecord = {
  id: string
  search_index_id: string
  version: number
  provider: string
  physical_name: string
  definition_hash: string
  status: string
  build_seq: string | null
}

/** One seed run against one index version. Append-only, so these are the history. */
export type SearchIndexSyncRecord = {
  id: string
  search_index_version_id: string
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

/* ----------------------------- seed plans ----------------------------- */

// `SearchIndexMigrationAction` is public — `db:migrate` plans and executes it —
// and lives on `SearchTypes`. Seeding stays internal: application start is its
// only caller.

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
  /** The version being filled. */
  target_version: SearchIndexVersionRecord
  /** Whether `target_version` becomes active once filled. */
  swap: boolean
  reason: SearchIndexSeedReason
}
