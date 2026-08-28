import {
  GraphResultSet,
  IIndexService,
  ISearchModuleService,
  LoadedModule,
  MedusaContainer,
  ModuleJoinerConfig,
  RemoteJoinerOptions,
  RemoteJoinerQuery,
  RemoteQueryFilters,
  RemoteQueryFunction,
  RemoteQueryFunctionReturnPagination,
  RemoteQueryInput,
  RemoteQueryObjectConfig,
  RemoteQueryObjectFromStringResult,
  SearchResultSet,
  SearchTypes,
} from "@medusajs/types"
import {
  MedusaError,
  applyTranslations,
  Cached,
  GraphQLUtils,
  isObject,
  promiseAll,
  remoteQueryObjectFromString,
  unflattenObjectKeys,
  isString,
} from "@medusajs/utils"
import { RelationMap, RemoteJoiner } from "../joiner"
import { queryCacheDecoratorOptions } from "./cache"
import { ModuleDataFetcher } from "./module-data-fetcher"
import { toRemoteJoinerQuery } from "./to-remote-joiner-query"
import { toRemoteQuery } from "./to-remote-query"

/**
 * Public query API for Medusa's cross-module graph query system.
 *
 * Accepts several input shapes (graph config, legacy string config, GraphQL,
 * or a pre-built {@link RemoteJoinerQuery}), normalizes them via
 * {@link normalizeQuery}, and delegates execution to {@link RemoteJoiner}.
 *
 * {@link RemoteJoiner} resolves relationships from module joiner configs,
 * plans nested expands, and loads data through {@link ModuleDataFetcher}
 * ({@link IRemoteDataFetcher}). This class adds response shaping, caching,
 * locale translation, and index-assisted querying on top of that pipeline.
 *
 * ```
 * user input → normalizeQuery() → RemoteJoiner.query() → ModuleDataFetcher.fetch()
 * ```
 */
export class Query {
  #remoteJoiner: RemoteJoiner
  #joinerConfigs: ModuleJoinerConfig[]
  #indexModule: IIndexService
  #searchModule?: ISearchModuleService
  protected container: MedusaContainer

  static traceGraphQuery?: (
    queryFn: () => Promise<any>,
    queryOptions: RemoteQueryInput<any>
  ) => Promise<any>

  static traceRemoteQuery?: (
    queryFn: () => Promise<any>,
    queryOptions:
      | RemoteQueryObjectConfig<any>
      | RemoteQueryObjectFromStringResult<any>
      | RemoteJoinerQuery
  ) => Promise<any>

  static instrument = {
    graphQuery(tracer: (typeof Query)["traceGraphQuery"]) {
      Query.traceGraphQuery = tracer
    },
    remoteQuery(tracer: (typeof Query)["traceRemoteQuery"]) {
      Query.traceRemoteQuery = tracer
    },
    remoteDataFetch(
      tracer: (typeof ModuleDataFetcher)["traceFetchRemoteData"]
    ) {
      ModuleDataFetcher.traceFetchRemoteData = tracer
    },
  }

  constructor({
    remoteJoiner,
    joinerConfigs,
    indexModule,
    searchModule,
    container,
  }: {
    remoteJoiner: RemoteJoiner
    joinerConfigs: ModuleJoinerConfig[]
    indexModule: IIndexService
    searchModule?: ISearchModuleService
    container: MedusaContainer
  }) {
    this.#remoteJoiner = remoteJoiner
    this.#joinerConfigs = joinerConfigs
    this.#indexModule = indexModule
    this.#searchModule = searchModule
    this.container = container
  }

  async query(
    queryOptions:
      | RemoteQueryInput<any>
      | RemoteQueryObjectConfig<any>
      | RemoteQueryObjectFromStringResult<any>
      | RemoteJoinerQuery,
    options?: RemoteJoinerOptions
  ) {
    if (!isObject(queryOptions)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid query, expected object and received something else."
      )
    }

    let config: any = queryOptions

    if ("__value" in queryOptions) {
      config = queryOptions.__value
    } else if ("entity" in config) {
      config = toRemoteQuery(config, this.#joinerConfigs)
    } else if ("entryPoint" in config || "service" in config) {
      config = remoteQueryObjectFromString(
        config as Parameters<typeof remoteQueryObjectFromString>[0]
      ).__value
    }

    if (Query.traceRemoteQuery) {
      return await Query.traceRemoteQuery(
        async () => await this.internalQuery(config, undefined, options),
        queryOptions
      )
    }

    return await this.internalQuery(config, undefined, options)
  }

  async gql(
    query: string,
    variables?: Record<string, unknown>,
    options?: RemoteJoinerOptions
  ) {
    const joinerQuery = parseGraphqlQuery(query, variables)
    return await this.internalQuery(joinerQuery, undefined, options)
  }

  @Cached(queryCacheDecoratorOptions)
  async graph<const TEntry extends string>(
    queryOptions: RemoteQueryInput<TEntry>,
    options?: RemoteJoinerOptions
  ): Promise<GraphResultSet<TEntry>> {
    const normalizedQuery = toRemoteQuery(queryOptions, this.#joinerConfigs)

    let response:
      | any[]
      | { rows: any[]; metadata: RemoteQueryFunctionReturnPagination }

    if (Query.traceGraphQuery) {
      response = await Query.traceGraphQuery(
        async () =>
          await this.internalQuery(normalizedQuery, undefined, options),
        queryOptions as RemoteQueryInput<any>
      )
    } else {
      response = await this.internalQuery(normalizedQuery, undefined, options)
    }

    let result: GraphResultSet<any>

    if (Array.isArray(response)) {
      result = { data: response, metadata: undefined }
    } else {
      result = {
        data: response.rows,
        metadata: response.metadata,
      }
    }

    if (options?.locale) {
      await applyTranslations({
        localeCode: options.locale,
        objects: result.data,
        container: this.container,
      })
    }

    return result
  }

  /**
   * Runs a search and expands the hits with `query.graph`.
   *
   * The engine only holds what its index was defined with, so the requested
   * fields are split: what the index can return comes back from the search, and
   * the rest is fetched by id. Search order is preserved through the expand.
   *
   * Pass an array to run several queries in one provider round-trip — InstantSearch
   * extra facet requests, or `disjunctive_facets` expansion, go through this path.
   */
  async search<const TEntry extends string>(
    queryOptions: SearchTypes.SearchQuery<TEntry>[],
    options?: RemoteJoinerOptions
  ): Promise<SearchResultSet<TEntry>[]>
  async search<const TEntry extends string>(
    queryOptions: SearchTypes.SearchQuery<TEntry>,
    options?: RemoteJoinerOptions
  ): Promise<SearchResultSet<TEntry>>
  async search<const TEntry extends string>(
    queryOptions:
      | SearchTypes.SearchQuery<TEntry>
      | SearchTypes.SearchQuery<TEntry>[],
    options?: RemoteJoinerOptions
  ): Promise<SearchResultSet<TEntry> | SearchResultSet<TEntry>[]> {
    if (!this.#searchModule) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Search module is not loaded."
      )
    }

    const isMany = Array.isArray(queryOptions)
    const queries = isMany ? queryOptions : [queryOptions]
    const prepared = queries.map((query) => this.prepareSearchQuery(query))

    const searchResults = await this.#searchModule.searchMany(
      prepared.map((item) => item.engineQuery)
    )

    const results = await promiseAll(
      searchResults.map((searchResult, i) =>
        this.hydrateSearchResult(prepared[i], searchResult, options)
      )
    )

    return isMany ? results : results[0]
  }

  private prepareSearchQuery<const TEntry extends string>(
    queryOptions: SearchTypes.SearchQuery<TEntry>
  ): {
    entity: string
    engineQuery: SearchTypes.SearchQuery<TEntry>
    graphFields: string[]
  } {
    const entity = queryOptions.entity
    const retrievableFields = this.#searchModule!.listRetrievableFields(entity)
    // Without an explicit selection, return what the index holds.
    const requested = queryOptions.fields ?? retrievableFields
    const retrievable = new Set(retrievableFields)

    return {
      entity,
      engineQuery: {
        ...queryOptions,
        fields: requested.filter((field) => retrievable.has(field)),
      },
      graphFields: requested.filter((field) => !retrievable.has(field)),
    }
  }

  private async hydrateSearchResult<const TEntry extends string>(
    prepared: { entity: string; graphFields: string[] },
    searchResult: SearchTypes.SearchResult,
    options?: RemoteJoinerOptions
  ): Promise<SearchResultSet<TEntry>> {
    let data = searchResult.hits.map((hit) => hit.document) as any[]

    if (prepared.graphFields.length && data.length) {
      // A hit is identified by the index' primary key, and the fetched rows are
      // merged back onto the documents by it, so it has to be both filtered on
      // and selected — whether or not the caller asked for it.
      const { primary_key: primaryKey } = this.#searchModule!.getIndex(
        prepared.entity
      )
      const hydrationFields = prepared.graphFields.includes(primaryKey)
        ? prepared.graphFields
        : [...prepared.graphFields, primaryKey]

      const expanded = await this.graph(
        {
          entity: prepared.entity,
          fields: hydrationFields,
          filters: {
            [primaryKey]: searchResult.hits.map((hit) => hit.id),
          } as any,
          // `take` forces the select-in strategy, as in `index`.
          pagination: { take: searchResult.hits.length },
        } as RemoteQueryInput<TEntry>,
        // `initialData` merges what the engine returned into the fetched rows
        // and keeps them in search order.
        { ...options, initialData: data }
      )

      data = expanded.data
    }

    return { data, search_result: searchResult } as SearchResultSet<TEntry>
  }

  @Cached(queryCacheDecoratorOptions)
  async index<const TEntry extends string>(
    queryOptions: RemoteQueryInput<TEntry> & {
      joinFilters?: RemoteQueryFilters<TEntry>
    },
    options?: RemoteJoinerOptions
  ): Promise<GraphResultSet<TEntry>> {
    if (!this.#indexModule) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Index module is not loaded."
      )
    }

    const mainEntity = queryOptions.entity

    const fields = [mainEntity + ".id"]
    const filters = queryOptions.filters
      ? { [mainEntity]: queryOptions.filters }
      : ({} as any)
    const joinFilters = queryOptions.joinFilters
      ? { [mainEntity]: queryOptions.joinFilters }
      : ({} as any)
    const pagination = queryOptions.pagination as any
    if (pagination?.order) {
      pagination.order = {
        [mainEntity]: unflattenObjectKeys(pagination?.order),
      }
    }

    const indexResponse = (await this.#indexModule.query({
      fields,
      filters,
      joinFilters,
      pagination,
      idsOnly: true,
    })) as unknown as GraphResultSet<TEntry>

    delete queryOptions.filters

    const idFilters = {
      id: indexResponse.data.map((item) => item.id),
    } as any

    queryOptions.filters = idFilters

    const graphOptions: RemoteQueryInput<TEntry> = {
      ...queryOptions,
      pagination: {
        // We pass through `take` to force the `select-in` query strategy
        //   There might be a better way to do this, but for now this should do
        take: queryOptions.pagination?.take ?? indexResponse.data.length,
      },
    }

    let finalResultset: GraphResultSet<TEntry> = indexResponse

    if (indexResponse.data.length) {
      finalResultset = await this.graph(graphOptions, {
        ...options,
        initialData: indexResponse.data,
      })
    }

    if (options?.locale) {
      await applyTranslations({
        localeCode: options.locale,
        objects: finalResultset.data,
        container: this.container,
      })
    }

    return {
      data: finalResultset.data,
      metadata: indexResponse.metadata as RemoteQueryFunctionReturnPagination,
    }
  }

  private async internalQuery(
    query: RemoteJoinerQuery | object,
    variables?: Record<string, unknown>,
    options?: RemoteJoinerOptions
  ): Promise<any> {
    let finalQuery: RemoteJoinerQuery = query as RemoteJoinerQuery

    if (!isString(finalQuery?.service) && !isString(finalQuery?.alias)) {
      finalQuery = toRemoteJoinerQuery(query, variables)
    }

    return await this.#remoteJoiner.query(finalQuery, options)
  }
}

export function createQuery({
  modulesLoaded,
  relationMap,
  indexModule,
  searchModule,
  container,
}: {
  modulesLoaded: LoadedModule[]
  relationMap: RelationMap
  indexModule: IIndexService
  searchModule?: ISearchModuleService
  container: MedusaContainer
}) {
  const joinerConfigs: ModuleJoinerConfig[] = []
  const modulesMap: Map<string, LoadedModule> = new Map()

  for (const mod of modulesLoaded) {
    if (!mod.__definition.isQueryable) {
      continue
    }

    const serviceName = mod.__definition.key

    if (modulesMap.has(serviceName)) {
      throw new Error(
        `Duplicated instance of module ${serviceName} is not allowed.`
      )
    }

    modulesMap.set(serviceName, mod)
    joinerConfigs.push(mod.__joinerConfig)
  }

  const dataFetcher = new ModuleDataFetcher(modulesMap)
  const remoteJoiner = new RemoteJoiner(joinerConfigs, dataFetcher, {
    autoCreateServiceNameAlias: false,
    relationMap,
  })

  const query = new Query({
    remoteJoiner,
    joinerConfigs,
    indexModule,
    searchModule,
    container,
  })

  function backwardCompatibleQuery(...args: any[]) {
    return new Query({
      remoteJoiner,
      joinerConfigs,
      indexModule,
      searchModule,
      container,
    }).query.apply(query, args)
  }

  backwardCompatibleQuery.graph = query.graph.bind(query)
  backwardCompatibleQuery.gql = query.gql.bind(query)
  backwardCompatibleQuery.index = query.index.bind(query)
  backwardCompatibleQuery.search = query.search.bind(query)

  return backwardCompatibleQuery as Omit<RemoteQueryFunction, symbol>
}

export function parseGraphqlQuery(
  graphqlQuery: string,
  variables?: Record<string, unknown>
): RemoteJoinerQuery {
  const parser = new GraphQLUtils.GraphQLParser(graphqlQuery, variables)
  return parser.parseQuery()
}
