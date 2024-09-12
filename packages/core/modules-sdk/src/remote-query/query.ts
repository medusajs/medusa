import {
  GraphResultSet,
  RemoteJoinerOptions,
  RemoteJoinerQuery,
  RemoteQueryFunction,
  RemoteQueryFunctionReturnPagination,
  RemoteQueryInput,
  RemoteQueryObjectConfig,
  RemoteQueryObjectFromStringResult,
} from "@medusajs/types"
import {
  MedusaError,
  isObject,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { RemoteQuery } from "./remote-query"
import { toRemoteQuery } from "./to-remote-query"

/**
 * API wrapper around the remoteQuery
 */
export class Query {
  #remoteQuery: RemoteQuery

  constructor(remoteQuery: RemoteQuery) {
    this.#remoteQuery = remoteQuery
  }

  #unwrapQueryConfig(
    config:
      | RemoteQueryObjectFromStringResult<any>
      | RemoteQueryObjectConfig<any>
      | RemoteJoinerQuery
  ): object {
    let normalizedQuery: any = config

    if ("__value" in config) {
      normalizedQuery = config.__value
    } else if ("entity" in normalizedQuery) {
      normalizedQuery = toRemoteQuery(normalizedQuery)
    } else if (
      "entryPoint" in normalizedQuery ||
      "service" in normalizedQuery
    ) {
      normalizedQuery = remoteQueryObjectFromString(
        normalizedQuery as Parameters<typeof remoteQueryObjectFromString>[0]
      ).__value
    }

    return normalizedQuery
  }

  #unwrapRemoteQueryResponse(
    response:
      | any[]
      | { rows: any[]; metadata: RemoteQueryFunctionReturnPagination }
  ): GraphResultSet<any> {
    if (Array.isArray(response)) {
      return { data: response, metadata: undefined }
    }

    return {
      data: response.rows,
      metadata: response.metadata,
    }
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

    const config = this.#unwrapQueryConfig(queryOptions)
    return await this.#remoteQuery.query(config, undefined, options)
  }

  /**
   * Query wrapper to provide specific GraphQL like API around remoteQuery.query
   * @param query
   * @param variables
   * @param options
   */
  async gql(query, variables?, options?) {
    return await this.#remoteQuery.query(query, variables, options)
  }

  /**
   * Graph function uses the remoteQuery under the hood and
   * returns a result set
   */
  async graph<const TEntry extends string>(
    queryOptions: RemoteQueryInput<TEntry>,
    options?: RemoteJoinerOptions
  ): Promise<GraphResultSet<TEntry>> {
    const normalizedQuery = toRemoteQuery(queryOptions)
    const response = await this.#remoteQuery.query(
      normalizedQuery,
      undefined,
      options
    )

    return this.#unwrapRemoteQueryResponse(response)
  }
}

/**
 * API wrapper around the remoteQuery with backward compatibility support
 * @param remoteQuery
 */
export function createQuery(remoteQuery: RemoteQuery): RemoteQueryFunction {
  const query = new Query(remoteQuery)

  function backwardCompatibleQuery(...args: any[]) {
    return query.query.apply(query, args)
  }

  backwardCompatibleQuery.graph = query.graph.bind(query)
  backwardCompatibleQuery.gql = query.gql.bind(query)

  return backwardCompatibleQuery
}
