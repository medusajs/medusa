import { RemoteQuery } from "./remote-query"
import {
  RemoteJoinerOptions,
  RemoteJoinerQuery,
  RemoteQueryFunction,
  RemoteQueryObjectConfig,
  RemoteQueryObjectFromStringResult,
} from "@medusajs/types"
import {
  isObject,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

// Memoisation of the query function
let query_: RemoteQueryFunction

function unwrapQueryConfig(
  config:
    | RemoteQueryObjectConfig<any>
    | RemoteQueryObjectFromStringResult<any>
    | RemoteJoinerQuery
): object {
  let normalizedQuery: any = config

  if ("__value" in config) {
    normalizedQuery = config.__value
  } else if ("entryPoint" in normalizedQuery || "service" in normalizedQuery) {
    normalizedQuery = remoteQueryObjectFromString(
      normalizedQuery as Parameters<typeof remoteQueryObjectFromString>[0]
    ).__value
  }

  return normalizedQuery
}

/**
 * Wrap the remote query into a dedicated and more user friendly API than the low level API
 * @param remoteQuery
 */
export function createQuery(remoteQuery: RemoteQuery): RemoteQueryFunction {
  if (query_) {
    return query_
  }

  const query: RemoteQueryFunction = async (
    queryOptions:
      | RemoteQueryObjectConfig<any>
      | RemoteQueryObjectFromStringResult<any>
      | RemoteJoinerQuery,
    options?: RemoteJoinerOptions
  ) => {
    if (!isObject(queryOptions)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid query, expected object and received something else."
      )
    }

    const config = unwrapQueryConfig(queryOptions)
    return await remoteQuery.query(config, undefined, options)
  }

  /**
   * Query wrapper to provide specific GraphQL like API around remoteQuery.query
   * @param query
   * @param variables
   * @param options
   */
  query.gql = async function (query, variables?, options?) {
    return await remoteQuery.query(query, variables, options)
  }

  /**
   * Graph function uses the remoteQuery under the hood and
   * returns a result set
   */
  query.graph = async function (queryOptions, options) {
    const normalizedQuery = remoteQueryObjectFromString(queryOptions).__value
    const response = await remoteQuery.query(
      normalizedQuery,
      undefined,
      options
    )

    if (Array.isArray(response)) {
      return { data: response, metadata: undefined }
    }

    return {
      data: response.rows,
      metadata: response.metadata,
    }
  }

  query_ = query
  return query_
}
