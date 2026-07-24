import {
  GraphResultSet,
  IIndexService,
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
} from "@medusajs/types"
import {
  MedusaError,
  applyTranslations,
  Cached,
  GraphQLUtils,
  isObject,
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
    container,
  }: {
    remoteJoiner: RemoteJoiner
    joinerConfigs: ModuleJoinerConfig[]
    indexModule: IIndexService
    container: MedusaContainer
  }) {
    this.#remoteJoiner = remoteJoiner
    this.#joinerConfigs = joinerConfigs
    this.#indexModule = indexModule
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
  container,
}: {
  modulesLoaded: LoadedModule[]
  relationMap: RelationMap
  indexModule: IIndexService
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
    container,
  })

  function backwardCompatibleQuery(...args: any[]) {
    return new Query({
      remoteJoiner,
      joinerConfigs,
      indexModule,
      container,
    }).query.apply(query, args)
  }

  backwardCompatibleQuery.graph = query.graph.bind(query)
  backwardCompatibleQuery.gql = query.gql.bind(query)
  backwardCompatibleQuery.index = query.index.bind(query)

  return backwardCompatibleQuery as Omit<RemoteQueryFunction, symbol>
}

export function parseGraphqlQuery(
  graphqlQuery: string,
  variables?: Record<string, unknown>
): RemoteJoinerQuery {
  const parser = new GraphQLUtils.GraphQLParser(graphqlQuery, variables)
  return parser.parseQuery()
}
