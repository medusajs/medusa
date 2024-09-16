import { Prettify } from "../common"
import { RemoteJoinerOptions, RemoteJoinerQuery } from "../joiner"
import { RemoteQueryEntryPoints } from "./remote-query-entry-points"
import {
  RemoteQueryInput,
  RemoteQueryObjectConfig,
  RemoteQueryObjectFromStringResult,
} from "./remote-query-object-from-string"

/*type ExcludedProps = "__typename"*/

export type RemoteQueryFunctionReturnPagination = {
  skip: number
  take: number
  count: number
}

/**
 * The GraphResultSet presents a typed output for the
 * result returned by the underlying remote query
 */
export type GraphResultSet<TEntry extends string> = {
  data: TEntry extends keyof RemoteQueryEntryPoints
    ? RemoteQueryEntryPoints[TEntry][]
    : any[]
  metadata?: RemoteQueryFunctionReturnPagination
}

/**
 * QueryGraphFunction is a wrapper on top of remoteQuery
 * that simplifies the input it accepts and returns
 * a normalized/consistent output.
 */
export type QueryGraphFunction = {
  <const TEntry extends string>(
    queryConfig: RemoteQueryInput<TEntry>,
    options?: RemoteJoinerOptions
  ): Promise<Prettify<GraphResultSet<TEntry>>>
}

/*export type RemoteQueryReturnedData<TEntry extends string> =
  TEntry extends keyof RemoteQueryEntryPoints
    ? Prettify<Omit<RemoteQueryEntryPoints[TEntry], ExcludedProps>>
    : any*/

/*export type NarrowRemoteFunctionReturnType<
  TConfig extends RemoteQueryObjectConfig<any>
> = TConfig extends RemoteQueryObjectConfig<infer TEntry>
  ? TConfig extends { variables: infer Variables }
    ? Variables extends { skip: number }
      ? {
          rows: RemoteQueryReturnedData<TEntry>[]
          metadata: RemoteQueryFunctionReturnPagination
        }
      : Variables extends { skip?: number | undefined } | { skip?: number }
      ? // TODO: the real type is the one in parenthsis but we put any for now as the current API is broken and need fixin in a separate iteration (RemoteQueryReturnedData<TEntry>[] | {rows: RemoteQueryReturnedData<TEntry>[] metadata: RemoteQueryFunctionReturnPagination })
        any
      : RemoteQueryReturnedData<TEntry>[]
    : RemoteQueryReturnedData<TEntry>[]
  : never*/

/*export type RemoteQueryFunctionReturnType<
  TConfig extends
    | RemoteQueryObjectConfig<any>
    | RemoteQueryObjectFromStringResult<any>
> = TConfig extends RemoteQueryObjectFromStringResult<any>
  ? NarrowRemoteFunctionReturnType<TConfig['__value']>
  : TConfig extends RemoteQueryObjectConfig<any>
  ? NarrowRemoteFunctionReturnType<TConfig>
  : never*/

export type RemoteQueryFunction = {
  /**
   * Query wrapper to provide specific API's and pre processing around remoteQuery.query
   * @param queryConfig
   * @param options
   */
  <const TEntry extends string>(
    queryConfig: RemoteQueryObjectConfig<TEntry>,
    options?: RemoteJoinerOptions
  ): Promise<any>

  /**
   * Query wrapper to provide specific API's and pre processing around remoteQuery.query
   * @param queryConfig
   * @param options
   */
  <const TConfig extends RemoteQueryObjectFromStringResult<any>>(
    queryConfig: TConfig,
    options?: RemoteJoinerOptions
  ): Promise<any>
  /**
   * Query wrapper to provide specific API's and pre processing around remoteQuery.query
   * @param query
   * @param options
   */
  (query: RemoteJoinerQuery, options?: RemoteJoinerOptions): Promise<any>

  /**
   * Graph function uses the remoteQuery under the hood and
   * returns a result set
   */
  graph: QueryGraphFunction

  /**
   * Query wrapper to provide specific GraphQL like API around remoteQuery.query
   * @param query
   * @param variables
   * @param options
   */
  gql: (
    query: string,
    variables?: Record<string, unknown>,
    options?: RemoteJoinerOptions
  ) => Promise<any>
}

export interface Query {
  /**
   * Query wrapper to provide specific API's and pre processing around remoteQuery.query
   * @param queryConfig
   * @param options
   */
  query<const TEntry extends string>(
    queryConfig: RemoteQueryObjectConfig<TEntry>,
    options?: RemoteJoinerOptions
  ): Promise<any>

  /**
   * Query wrapper to provide specific API's and pre processing around remoteQuery.query
   * @param queryConfig
   * @param options
   */
  query<const TConfig extends RemoteQueryObjectFromStringResult<any>>(
    queryConfig: TConfig,
    options?: RemoteJoinerOptions
  ): Promise<any>
  /**
   * Query wrapper to provide specific API's and pre processing around remoteQuery.query
   * @param query
   * @param options
   */
  query(query: RemoteJoinerQuery, options?: RemoteJoinerOptions): Promise<any>

  /**
   * Graph function uses the remoteQuery under the hood and
   * returns a result set
   */
  graph: QueryGraphFunction

  /**
   * Query wrapper to provide specific GraphQL like API around remoteQuery.query
   * @param query
   * @param variables
   * @param options
   */
  gql: (
    query: string,
    variables?: Record<string, unknown>,
    options?: RemoteJoinerOptions
  ) => Promise<any>
}
