import { Logger, SearchTypes } from "@medusajs/framework/types"
import {
  AbstractSearchProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  buildFacetQueries,
  buildIndexPlan,
  buildQueryPlan,
  fromSearchDocument,
  MedusaSearchClient,
  CloudServiceError,
  MedusaSearchProviderOptions,
  parseFacetResults,
  parseHighlights,
  sameSchemaType,
  toSearchDocument,
  toSearchFilter,
  validateMedusaSearchOptions,
  type IndexQuery,
  type Row,
} from "../utils"

type InjectedDependencies = {
  logger?: Logger
}

const MAX_WRITE_BYTES = 480 * 1024 * 1024
const MAX_MULTI_QUERIES = 16

export class MedusaSearchService extends AbstractSearchProviderService {
  static identifier = "search-medusa"

  protected readonly logger_?: Logger
  protected readonly options_: MedusaSearchProviderOptions
  protected readonly client_: MedusaSearchClient

  constructor(
    { logger }: InjectedDependencies = {},
    options: MedusaSearchProviderOptions
  ) {
    super()

    validateMedusaSearchOptions(options)

    this.logger_ = logger
    this.options_ = options
    this.client_ = new MedusaSearchClient(options)
  }

  /**
   * Cloud scopes storage from the environment handle. The provider
   * passes Medusa physical index names unchanged.
   */
  protected index(name: string) {
    return this.client_.index(name)
  }

  async upsertIndex({
    index,
  }: {
    index: SearchTypes.ResolvedSearchIndexDefinition
  }): Promise<SearchTypes.SearchTask> {
    const plan = buildIndexPlan(index)
    const remote = this.index(index.physical_name)

    // Migration is the only place that reconciles schema / existence. Runtime
    // writes and clears assume the index is already there.
    let metadata
    try {
      metadata = await remote.metadata()
    } catch (error) {
      if (!(error instanceof CloudServiceError && error.isNotFound)) {
        throw error
      }

      await this.client_.createIndex({
        name: index.physical_name,
        schema: plan.schema,
        distance_metric: plan.options.distance_metric,
        sharding: plan.options.sharding,
      })
      return this.task(index.physical_name)
    }

    if (!sameSchemaType(metadata.schema, plan.schema)) {
      // The Search Module only calls this for an index that is about to be
      // seeded. Type changes and removals cannot be applied in place.
      await remote.deleteAll()
      await this.client_.createIndex({
        name: index.physical_name,
        schema: plan.schema,
        distance_metric: plan.options.distance_metric,
        sharding: plan.options.sharding,
      })
      return this.task(index.physical_name)
    }

    await remote.updateSchema({ schema: plan.schema })
    return this.task(index.physical_name)
  }

  async deleteIndex({
    index,
  }: {
    index: string
  }): Promise<SearchTypes.SearchTask> {
    try {
      await this.index(index).deleteAll()
    } catch (error) {
      if (!(error instanceof CloudServiceError && error.isNotFound)) {
        throw error
      }
    }
    return this.task(index)
  }

  /**
   * Lists indexes for this Cloud environment. Document counts come from
   * metadata (`approx_row_count`) rather than a Count aggregation per index.
   */
  async listIndexes(): Promise<SearchTypes.SearchIndexInfo[]> {
    const entries: { id: string }[] = []

    for await (const entry of this.client_.indexes()) {
      entries.push(entry)
    }

    return await Promise.all(
      entries.map(async (entry) => {
        const metadata = await this.client_.index(entry.id).metadata()

        return {
          name: entry.id,
          provider: MedusaSearchService.identifier,
          document_count: Number(metadata.approx_row_count ?? 0),
          created_at: new Date(metadata.created_at),
          updated_at: new Date(metadata.updated_at),
        }
      })
    )
  }

  async upsertDocuments({
    index,
    definition,
    documents,
  }: {
    index: string
    definition: SearchTypes.ResolvedSearchIndexDefinition
    documents: SearchTypes.SearchDocument[]
  }): Promise<SearchTypes.SearchTask> {
    const plan = buildIndexPlan(definition)
    const rows = documents.map((document) => toSearchDocument(document, plan))
    const remote = this.index(index)

    for (const chunk of this.chunkRows(rows)) {
      await remote.write({
        upsert_rows: chunk,
        schema: plan.schema,
        distance_metric: plan.options.distance_metric,
      })
    }

    return this.task(index)
  }

  async deleteDocuments({
    index,
    filters,
  }: SearchTypes.SearchDeleteDocumentsInput): Promise<SearchTypes.SearchTask> {
    const compiled = toSearchFilter(filters)
    if (!compiled) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Deleting Medusa search documents requires filters"
      )
    }

    let remaining = true
    while (remaining) {
      const response = await this.index(index).write({
        delete_by_filter: compiled,
        delete_by_filter_allow_partial: true,
      })
      remaining = response.rows_remaining === true
    }

    return this.task(index)
  }

  async clearIndex({
    index,
  }: {
    index: string
  }): Promise<SearchTypes.SearchTask> {
    try {
      let remaining = true
      while (remaining) {
        const response = await this.index(index).write({
          delete_by_filter: ["id", "NotEq", null],
          delete_by_filter_allow_partial: true,
        })
        remaining = response.rows_remaining === true
      }
    } catch (error) {
      if (!(error instanceof CloudServiceError && error.isNotFound)) {
        throw error
      }
    }

    return this.task(index)
  }

  async search(
    input: SearchTypes.ProviderSearchQuery
  ): Promise<SearchTypes.SearchResult> {
    const plan = buildIndexPlan(input.index)
    const base = buildQueryPlan(input, plan)
    const facets = buildFacetQueries(input, plan)
    const includeCount = input.search_options?.count !== "none"
    const queries: IndexQuery[] = [base.query]
    const countIndex = includeCount ? queries.length : -1

    if (includeCount) {
      queries.push({
        aggregate_by: { count: ["Count"] },
        filters: base.query.filters,
      })
    }
    const facetOffset = queries.length
    queries.push(...facets.map((facet) => facet.query))

    if (queries.length > MAX_MULTI_QUERIES) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Medusa search accepts at most ${MAX_MULTI_QUERIES} queries per multi-query; this search needs ${queries.length}`
      )
    }

    const response = await this.index(input.index.physical_name).multiQuery({
      queries,
      consistency: base.options.consistency
        ? { level: base.options.consistency }
        : undefined,
    })
    const hitResult = response.results[0]
    const rows = (hitResult?.rows ?? []).slice(base.skip, base.skip + base.take)
    const parsedFacets = parseFacetResults(
      facets,
      response.results.slice(facetOffset)
    )

    return {
      hits: rows.map((row) => ({
        id: String(row.id),
        score: input.search_options?.include_score ? row.$dist : undefined,
        document: fromSearchDocument(
          row as Row,
          input.attributes_to_retrieve
        ),
        highlights: parseHighlights(row as Row, base.highlight),
      })),
      facets: parsedFacets,
      metadata: {
        skip: base.skip,
        take: base.take,
        count:
          countIndex === -1
            ? null
            : Number(response.results[countIndex]?.aggregations?.count ?? 0),
        query: input.q,
        processing_time_ms: response.performance.server_total_ms,
      },
      provider_metadata: {
        billing: response.billing,
        performance: response.performance,
      },
    }
  }

  async searchMany(
    inputs: SearchTypes.ProviderSearchQuery[]
  ): Promise<SearchTypes.SearchResult[]> {
    return await Promise.all(inputs.map((input) => this.search(input)))
  }

  protected chunkRows(rows: Row[]): Row[][] {
    const chunks: Row[][] = []
    let chunk: Row[] = []
    let bytes = 0

    for (const row of rows) {
      const rowBytes = Buffer.byteLength(JSON.stringify(row), "utf8")
      if (rowBytes > MAX_WRITE_BYTES) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `A Medusa search document exceeds the ${MAX_WRITE_BYTES}-byte provider limit`
        )
      }
      if (chunk.length && bytes + rowBytes > MAX_WRITE_BYTES) {
        chunks.push(chunk)
        chunk = []
        bytes = 0
      }
      chunk.push(row)
      bytes += rowBytes
    }

    if (chunk.length) {
      chunks.push(chunk)
    }
    return chunks
  }

  protected task(index: string): SearchTypes.SearchTask {
    return { index, status: "succeeded" }
  }
}
