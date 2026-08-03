import {
  DAL,
  IEventBusModuleService,
  InternalModuleDeclaration,
  Logger,
  MedusaContainer,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  SearchTypes,
} from "@medusajs/framework/types"
import {
  MedusaError,
  MedusaService,
  Modules,
  promiseAll,
} from "@medusajs/framework/utils"
import {
  SearchIndexContext,
  SearchIndexMigrationAction,
  SearchIndexSeedAction,
  SearchModuleOptions,
} from "@types"
import {
  assertTaskAccepted,
  buildDisjunctiveFacetQueries,
  mergeDisjunctiveFacetResults,
  normalizeSearchQuery,
  resolveIndexDefinition,
  retrieveIndexDefinition,
  validateFieldUsage,
  validateIndexDefinition,
} from "@utils"
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
  baseRepository: DAL.RepositoryService
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
  protected readonly baseRepository_: DAL.RepositoryService
  protected readonly searchProviderService_: SearchProviderService

  protected readonly moduleOptions_: SearchModuleOptions

  // Definitions keyed by name, populated once on application start and read-only
  protected readonly indexes_: Record<
    string,
    SearchTypes.ResolvedSearchIndexDefinition
  > = {}

  // Passed down for migrations and seeding, among other things.
  protected readonly context_: SearchIndexContext

  constructor(
    container: InjectedDependencies,
    moduleOptions: SearchModuleOptions,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.logger_ = container.logger ?? (console as unknown as Logger)
    this.baseRepository_ = container.baseRepository
    this.searchProviderService_ = container.searchProviderService

    this.moduleOptions_ = (moduleOptions ??
      moduleDeclaration.options ??
      {}) as SearchModuleOptions

    this.isWorkerMode = moduleDeclaration.worker_mode !== "server"

    this.context_ = {
      container: container as unknown as MedusaContainer,
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
    onApplicationStart(this: SearchModuleService) {
      return this.onApplicationStart_()
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

  async reindex(
    input: SearchTypes.SearchReindexInput = {}
  ): Promise<SearchTypes.SearchReindexResult> {
    return await reindexIndexes(this.context_, input)
  }

  /**
   * Seeds whatever needs data.
   * Indexes that are not migrated yet are skipped.
   */
  protected async onApplicationStart_(): Promise<void> {
    this.registerIndexDefinitions_(this.moduleOptions_.indexes ?? [])

    if (!Object.keys(this.indexes_).length || !this.isWorkerMode) {
      return
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

  // Resolves each definition, checks it is internally coherent, and stores it.
  protected registerIndexDefinitions_(
    definitions: SearchTypes.SearchIndexDefinition[]
  ): void {
    if (!definitions.length) {
      return
    }

    const defaultProvider = this.searchProviderService_.getDefaultIdentifier(
      this.moduleOptions_.default_provider
    )

    const resolved = new Map<
      string,
      SearchTypes.ResolvedSearchIndexDefinition
    >()

    for (const definition of definitions) {
      if (resolved.has(definition.name)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Duplicate search index definition for "${definition.name}"`
        )
      }

      const entry = resolveIndexDefinition({
        definition,
        default_provider: defaultProvider,
        index_prefix: this.moduleOptions_.index_prefix,
      })

      validateIndexDefinition({ definition: entry })

      resolved.set(entry.name, entry)
    }

    for (const name of Object.keys(this.indexes_)) {
      delete this.indexes_[name]
    }

    Object.assign(this.indexes_, Object.fromEntries(resolved))
  }

  protected async createIndexMigrationPlan_(): Promise<
    SearchIndexMigrationAction[]
  > {
    return await createIndexMigrationPlan(this.context_)
  }

  protected async executeIndexMigrationPlan_(
    actions: SearchIndexMigrationAction[]
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
