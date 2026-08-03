import { Logger, SearchTypes } from "@medusajs/framework/types"
import {
  AbstractSearchProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  count as oramaCount,
  create as oramaCreate,
  removeMultiple as oramaRemoveMultiple,
  search as oramaSearch,
  upsertMultiple as oramaUpsertMultiple,
} from "@orama/orama"
import {
  assertIndexSupported,
  assertQuerySupported,
  buildIndexPlan,
  extractPrimaryKeyFilter,
  fromOramaFacets,
  IndexPlan,
  projectDocument,
  sameSchema,
  SOURCE_KEY,
  toOramaDocument,
  toOramaFacets,
  toOramaWhere,
} from "../utils"

type InjectedDependencies = {
  logger?: Logger
}

type StoredIndex = {
  name: string
  db: any
  plan: IndexPlan
  created_at: Date
  updated_at: Date
}

/**
 * Search provider backed by Orama, holding every index in process memory.
 *
 * Nothing is persisted, so it is meant for tests, local development and small
 * read-mostly datasets — a restart is an empty index until something reindexes.
 */
export class LocalSearchService extends AbstractSearchProviderService {
  static identifier = "search-local"

  protected readonly logger_?: Logger
  protected readonly indexes_: Map<string, StoredIndex> = new Map()

  constructor({ logger }: InjectedDependencies = {}) {
    super()
    this.logger_ = logger
  }

  /* ---------------------------- index lifecycle --------------------------- */

  async upsertIndex({
    index,
  }: {
    index: SearchTypes.ResolvedSearchIndexDefinition
  }): Promise<SearchTypes.SearchTask> {
    assertIndexSupported(index)

    const plan = buildIndexPlan(index)
    const existing = this.indexes_.get(index.physical_name)

    if (existing && sameSchema(existing.plan, plan)) {
      return this.task(index.physical_name)
    }

    // Orama fixes a schema at creation, so bringing an index up to date means
    // rebuilding it empty. That is safe because the module only ever points this
    // at an index it is about to seed — a shadow it will swap in, or a live one
    // it is refilling wholesale.
    this.indexes_.set(index.physical_name, {
      name: index.physical_name,
      db: oramaCreate({ schema: plan.schema as any }),
      plan,
      created_at: existing?.created_at ?? new Date(),
      updated_at: new Date(),
    })

    return this.task(index.physical_name)
  }

  async deleteIndex({
    index,
  }: {
    index: string
  }): Promise<SearchTypes.SearchTask> {
    this.indexes_.delete(index)
    return this.task(index)
  }

  async listIndexes(): Promise<SearchTypes.SearchIndexInfo[]> {
    return [...this.indexes_.values()].map((stored) => ({
      name: stored.name,
      provider: LocalSearchService.identifier,
      document_count: oramaCount(stored.db),
      created_at: stored.created_at,
      updated_at: stored.updated_at,
    }))
  }

  // Repointing an alias is just moving the database between keys.
  async swapIndex({
    alias,
    index,
  }: {
    alias: string
    index: string
  }): Promise<SearchTypes.SearchTask> {
    const shadow = this.retrieve(index)

    this.indexes_.set(alias, { ...shadow, name: alias, updated_at: new Date() })
    this.indexes_.delete(index)

    return this.task(alias)
  }

  /* -------------------------------- documents ---------------------------- */

  async upsertDocuments({
    index,
    documents,
  }: {
    index: string
    documents: SearchTypes.SearchDocument[]
  }): Promise<SearchTypes.SearchTask> {
    const stored = this.retrieve(index)

    await oramaUpsertMultiple(
      stored.db,
      documents.map((document) => toOramaDocument(document, stored.plan)) as any
    )

    stored.updated_at = new Date()

    return this.task(index)
  }

  async deleteDocuments({
    index,
    filters,
  }: SearchTypes.SearchDeleteDocumentsInput): Promise<SearchTypes.SearchTask> {
    const stored = this.retrieve(index)

    // Primary-key membership is the common case and Orama removes by id
    // directly, so it skips the search entirely. It also works whether or not
    // the primary key is declared filterable.
    const ids =
      extractPrimaryKeyFilter(filters, stored.plan) ??
      (await this.resolveIdsByFilter(stored, filters))

    await oramaRemoveMultiple(stored.db, ids)
    stored.updated_at = new Date()

    return this.task(index)
  }

  // Orama has no delete-by-predicate, so anything else is matched then removed.
  protected async resolveIdsByFilter(
    stored: StoredIndex,
    filters: SearchTypes.SearchFilters
  ): Promise<string[]> {
    const matched: any = await oramaSearch(stored.db, {
      term: "",
      where: toOramaWhere(filters, stored.plan) as any,
      limit: Math.max(oramaCount(stored.db), 1),
    } as any)

    return matched.hits.map((hit: any) => hit.id)
  }

  async clearIndex({
    index,
  }: {
    index: string
  }): Promise<SearchTypes.SearchTask> {
    const stored = this.retrieve(index)

    stored.db = oramaCreate({ schema: stored.plan.schema as any })
    stored.updated_at = new Date()

    return this.task(index)
  }

  /* ----------------------------------- read ------------------------------ */

  async search(
    input: SearchTypes.ProviderSearchQuery
  ): Promise<SearchTypes.SearchResult> {
    const stored = this.retrieve(input.index.physical_name)
    const { plan } = stored

    assertQuerySupported(input)

    const options = input.search_options ?? {}
    const skip = input.pagination?.skip ?? 0
    const take = input.pagination?.take ?? 20

    const properties = (
      options.attributes_to_search_on ?? plan.searchable
    ).filter((path) => plan.searchable.includes(path))

    const facetPlan = toOramaFacets(
      options.facets as SearchTypes.SearchFacetRequest[] | undefined,
      plan
    )

    const params: Record<string, unknown> = {
      term: input.q ?? "",
      where: toOramaWhere(input.filters, plan),
      facets: facetPlan?.orama,
      distinctOn: options.distinct,
    }

    // Orama treats an empty `properties` list as an error, and a term with no
    // searchable field can never match.
    if (input.q && properties.length) {
      params.properties = properties
    } else if (input.q && !properties.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Search index "${input.index.name}" has no searchable fields, so it cannot be queried by text`
      )
    }

    if (options.typo_tolerance) {
      params.tolerance = 1
    }

    const sortBy = this.resolveSortBy(input, plan)
    if (sortBy) {
      params.sortBy = sortBy
    }

    // `min_score` has to be applied to the whole result set, not just the
    // requested page, for the count to stay truthful.
    const minScore = options.min_score

    let hits: { id: string; score: number; document: any }[]
    let total: number
    let elapsed = 0
    let rawFacets: any

    if (minScore === undefined) {
      const result: any = await oramaSearch(stored.db, {
        ...params,
        limit: take,
        offset: skip,
      } as any)

      hits = result.hits
      total = result.count
      elapsed = result.elapsed?.raw ?? 0
      rawFacets = result.facets
    } else {
      const probe: any = await oramaSearch(stored.db, {
        ...params,
        limit: 0,
      } as any)

      const all: any = await oramaSearch(stored.db, {
        ...params,
        limit: Math.max(probe.count, 1),
        offset: 0,
      } as any)

      const kept = all.hits.filter((hit: any) => hit.score >= minScore)

      hits = kept.slice(skip, skip + take)
      total = kept.length
      elapsed = all.elapsed?.raw ?? 0
      rawFacets = all.facets
    }

    return {
      hits: hits.map((hit) => ({
        id: hit.id,
        score: options.include_score ? hit.score : undefined,
        document: projectDocument(
          hit.document[SOURCE_KEY] ?? hit.document,
          input.attributes_to_retrieve
        ),
      })),
      facets:
        facetPlan && rawFacets
          ? fromOramaFacets(rawFacets, facetPlan)
          : undefined,
      metadata: {
        skip,
        take,
        count: total,
        // Orama counts every match.
        count_is_estimate: false,
        query: input.q,
        // Orama reports elapsed time in nanoseconds.
        processing_time_ms: Number(elapsed) / 1e6,
      },
    }
  }

  async searchMany(
    inputs: SearchTypes.ProviderSearchQuery[]
  ): Promise<SearchTypes.SearchResult[]> {
    return await Promise.all(inputs.map((input) => this.search(input)))
  }

  /* --------------------------------- helpers ----------------------------- */

  protected resolveSortBy(
    input: SearchTypes.ProviderSearchQuery,
    plan: IndexPlan
  ): { property: string; order: "ASC" | "DESC" } | undefined {
    const order = Object.entries(input.pagination?.order ?? {})

    if (!order.length) {
      return undefined
    }

    const [property, direction] = order[0]

    // Relevance is Orama's default ordering.
    if (property === "_score") {
      return undefined
    }

    const planned = plan.fields.get(property)

    if (!planned) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot sort search index "${input.index.name}" by unknown field "${property}"`
      )
    }

    if (planned.is_array) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `The local search provider cannot sort by "${property}" because it holds multiple values`
      )
    }

    return { property, order: direction === "ASC" ? "ASC" : "DESC" }
  }

  protected retrieve(index: string): StoredIndex {
    const stored = this.indexes_.get(index)

    if (!stored) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `The local search provider has no index "${index}". Known indexes: ${
          [...this.indexes_.keys()].join(", ") || "(none)"
        }`
      )
    }

    return stored
  }

  protected task(index: string): SearchTypes.SearchTask {
    // Orama applies writes inline, so there is nothing to wait on and no task
    // id to hand back — the write is done by the time this returns.
    return { index, status: "succeeded" }
  }
}
