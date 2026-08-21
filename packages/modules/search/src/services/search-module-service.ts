import {
  Event,
  IEventBusModuleService,
  InternalModuleDeclaration,
  Logger,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  RemoteQueryFunction,
  SearchTypes,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  MedusaService,
  Modules,
  promiseAll,
} from "@medusajs/framework/utils"
import {
  SearchEventRoutes,
  SearchIndexContext,
  SearchIndexes,
  SearchIndexSeedAction,
  SearchModuleOptions,
} from "@types"
import {
  assertTaskAccepted,
  buildDisjunctiveFacetQueries,
  listIndexedFields,
  listRetrievablePaths,
  mergeDisjunctiveFacetResults,
  normalizeSearchQuery,
  resolveIndexDefinitions,
  retrieveIndexDefinition,
  SearchIndexState,
  validateFieldUsage,
} from "@utils"
import { buildEventRoutes, ingestEvent } from "../utils/ingestion"
import {
  createIndexMigrationPlan,
  executeIndexMigrationPlan,
} from "../utils/migrations"
import {
  createSeedPlan,
  executeSeedPlan,
  reindexIndexes,
} from "../utils/seeding"
import { joinerConfig } from "../joiner-config"
import { SearchProviderService } from "./search-provider"

type InjectedDependencies = {
  logger: Logger
  [Modules.EVENT_BUS]: IEventBusModuleService
  [ContainerRegistrationKeys.QUERY]: RemoteQueryFunction
  searchProviderService: SearchProviderService
  searchIndexService: ModulesSdkTypes.IMedusaInternalService<any>
  searchIndexSyncService: ModulesSdkTypes.IMedusaInternalService<any>
}

export default class SearchModuleService
  // Deliberately no models: `SearchIndex` and `SearchIndexSync` are the module's
  // own bookkeeping, so they get no generated CRUD and are not linkable. They are
  // still discovered from `src/models` for migrations.
  extends MedusaService({})
  implements SearchTypes.ISearchModuleService
{
  protected isWorkerMode: boolean = true

  protected readonly logger_: Logger
  protected readonly searchProviderService_: SearchProviderService

  protected readonly moduleOptions_: SearchModuleOptions

  // Definitions keyed by name, resolved once in the constructor. Nothing registers
  // an index at runtime, which is what lets a `definition_hash` change count as a
  // migration rather than a race.
  protected readonly indexes_: SearchIndexes

  // Passed down for migrations and seeding, among other things.
  protected readonly context_: SearchIndexContext

  // Built with the definitions, so routing a delivered event costs a lookup.
  protected readonly eventRoutes_: SearchEventRoutes

  constructor(
    container: InjectedDependencies,
    moduleOptions: SearchModuleOptions,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.logger_ = container.logger ?? (console as unknown as Logger)
    this.searchProviderService_ = container.searchProviderService

    this.moduleOptions_ = (moduleOptions ??
      moduleDeclaration.options ??
      {}) as SearchModuleOptions

    // `worker_mode` is stamped onto every module's declaration by the
    // modules-sdk from the application's own `projectConfig.workerMode`, so this
    // reads the same value `configModule` would give — an HTTP-only process
    // must not spend its boot seeding indexes.
    this.isWorkerMode = moduleDeclaration.worker_mode !== "server"

    // Resolved here rather than on application start, so anything that resolves the
    // module — `db:migrate` included — sees the definitions without booting first.
    this.indexes_ = this.moduleOptions_.indexes?.length
      ? resolveIndexDefinitions({
          definitions: this.moduleOptions_.indexes,
          default_provider:
            container.searchProviderService.getDefaultIdentifier(
              this.moduleOptions_.default_provider
            ),
          index_prefix: this.moduleOptions_.index_prefix,
        })
      : new Map()

    this.eventRoutes_ = buildEventRoutes(this.indexes_)

    this.context_ = {
      container,
      logger: this.logger_,
      options: this.moduleOptions_,
      indexes: this.indexes_,
      providers: container.searchProviderService,
      indexService: container.searchIndexService,
      syncService: container.searchIndexSyncService,
      locking: resolveLocking(container),
    }
  }

  // Declared so that `Module()` does not derive one by scanning `src/models`,
  // which would make the module's bookkeeping linkable.
  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  __hooks = {
    onApplicationStart: async () => {
      // Seeding can take a long time on a large catalog and must not delay the
      // worker from accepting jobs. Failures are logged rather than blocking boot.
      void this.onApplicationStart_().catch((error) => {
        this.logger_.error(
          `[Search] Failed to seed search indexes: ${error.message}`,
          error
        )
      })
    },
  }

  async search<T = Record<string, unknown>>(
    query: SearchTypes.SearchQuery
  ): Promise<SearchTypes.SearchResult<T>> {
    const [result] = await this.searchMany([query])
    return result as SearchTypes.SearchResult<T>
  }

  async searchMany(
    queries: SearchTypes.SearchQuery[]
  ): Promise<SearchTypes.SearchResult[]> {
    if (!queries.length) {
      return []
    }

    const prepared = queries.map((query) => {
      const index = retrieveIndexDefinition(this.indexes_, query.entity)
      const normalized = normalizeSearchQuery({ query, index })
      const provider = this.searchProviderService_.retrieve(index.provider)

      // Whether the *provider* can serve the query is the provider's call, made
      // while it translates. This only checks the query against the definition,
      // which is provider-independent.
      validateFieldUsage({ index, query: normalized })

      return { normalized, provider }
    })

    return await promiseAll(
      prepared.map(async ({ normalized, provider }) => {
        if (!normalized.search_options?.disjunctive_facets) {
          return await provider.search(normalized)
        }

        const { base, per_facet } = buildDisjunctiveFacetQueries(normalized)

        if (!per_facet.size) {
          return await provider.search(base)
        }

        // The base query carries the hits; the per-facet ones only recompute one
        // facet each with that facet's own filter lifted.
        const fields = [...per_facet.keys()]
        const inputs = [base, ...fields.map((field) => per_facet.get(field)!)]

        const [baseResult, ...facetResults] = provider.searchMany
          ? await provider.searchMany(inputs)
          : await promiseAll(inputs.map((input) => provider.search(input)))

        return mergeDisjunctiveFacetResults({
          base: baseResult,
          per_facet: new Map(
            fields.map((field, i) => [field, facetResults[i]])
          ),
        })
      })
    )
  }

  async upsertDocuments({
    index,
    documents,
  }: {
    index: string
    documents: SearchTypes.SearchDocument[]
  }): Promise<SearchTypes.SearchTask> {
    if (!documents.length) {
      return { index, status: "succeeded" }
    }

    const definition = retrieveIndexDefinition(this.indexes_, index)
    const provider = this.searchProviderService_.retrieve(definition.provider)

    const task = await provider.upsertDocuments({
      index: definition.physical_name,
      definition,
      documents,
    })

    return assertTaskAccepted(task, index)
  }

  async deleteDocuments({
    index,
    filters,
  }: {
    index: string
    filters: SearchTypes.SearchFilters
  }): Promise<SearchTypes.SearchTask> {
    if (!filters || !Object.keys(filters).length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Deleting from search index "${index}" requires filters; pass { id: [...] } to delete by id, or clear the index through a reindex`
      )
    }

    const definition = retrieveIndexDefinition(this.indexes_, index)
    const provider = this.searchProviderService_.retrieve(definition.provider)

    const task = await provider.deleteDocuments({
      index: definition.physical_name,
      filters,
    })

    return assertTaskAccepted(task, index)
  }

  // Waits for its writes, so awaiting this acknowledges the event.
  async ingest(event: Event<any>): Promise<SearchTypes.SearchTask[]> {
    return await ingestEvent(this.context_, {
      event,
      routes: this.eventRoutes_,
    })
  }

  async listIndexes(): Promise<SearchTypes.SearchIndexDetails[]> {
    const definitions = [...this.indexes_.values()].sort((a, b) =>
      a.name.localeCompare(b.name)
    )

    if (!definitions.length) {
      return []
    }

    const records = await this.context_.indexService.list(
      { name: definitions.map((definition) => definition.name) },
      { take: null }
    )
    const byName = new Map(records.map((record) => [record.name, record]))

    return definitions.map((definition) => {
      const record = byName.get(definition.name)

      return {
        name: definition.name,
        entity: definition.entity,
        provider: definition.provider,
        status: record?.status ?? SearchIndexState.PENDING,
        fields: listIndexedFields(definition.fields),
      }
    })
  }

  listRetrievableFields(index: string): string[] {
    return listRetrievablePaths(
      retrieveIndexDefinition(this.indexes_, index).fields
    )
  }

  getIndex(index: string): SearchTypes.ResolvedSearchIndexDefinition {
    return retrieveIndexDefinition(this.indexes_, index)
  }

  async reindex(
    input: SearchTypes.SearchReindexInput = {}
  ): Promise<SearchTypes.SearchReindexResult> {
    return await reindexIndexes(this.context_, input)
  }

  /**
   * Seeds whatever needs data. Indexes that are not migrated yet are skipped —
   * creating and migrating physical indexes is the application's job
   * (e.g. `db:migrate`), not something a booting worker invents.
   *
   * The exception is a provider that asked for it through `migrate_on_startup`,
   * whose indexes do not outlive the process that created them. Those are
   * migrated here first, so the index and the data filling it are built by the
   * same process.
   */
  protected async onApplicationStart_(): Promise<void> {
    if (!this.indexes_.size || !this.isWorkerMode) {
      return
    }

    // Unconditional for those providers: they start with nothing, so there is
    // no state worth inspecting first.
    for (const definition of this.indexes_.values()) {
      const provider = this.searchProviderService_.retrieve(definition.provider)

      if (provider.migrate_on_startup) {
        await provider.upsertIndex({ index: definition })
      }
    }

    const seeds = await this.createSeedPlan_()

    if (!seeds.length) {
      return
    }

    this.logger_.info(
      `[Search] Seeding ${seeds.length} index(es): ${seeds
        .map((seed) => `${seed.index} (${seed.reason})`)
        .join(", ")}`
    )

    await this.executeSeedPlan_(seeds)
  }

  protected async createSeedPlan_(): Promise<SearchIndexSeedAction[]> {
    return await createSeedPlan(this.context_)
  }

  protected async executeSeedPlan_(
    actions: SearchIndexSeedAction[]
  ): Promise<void> {
    await executeSeedPlan(this.context_, actions)
  }

  async createIndexMigrationPlan(): Promise<
    SearchTypes.SearchIndexMigrationAction[]
  > {
    return await createIndexMigrationPlan(this.context_)
  }

  async executeIndexMigrationPlan(
    actions: SearchTypes.SearchIndexMigrationAction[]
  ): Promise<void> {
    await executeIndexMigrationPlan(this.context_, actions)
  }
}

// The Locking Module is optional, and reading a missing registration off the
// container throws rather than returning undefined.
function resolveLocking(
  container: InjectedDependencies
): SearchIndexContext["locking"] {
  try {
    return container[Modules.LOCKING]
  } catch {
    return undefined
  }
}
