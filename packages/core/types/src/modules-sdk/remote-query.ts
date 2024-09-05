import { RemoteQueryEntryPoints } from "./remote-query-entry-points"
import { Prettify } from "../common"
import { RemoteJoinerOptions, RemoteJoinerQuery } from "../joiner"
import {
  RemoteQueryObjectConfig,
  RemoteQueryObjectFromStringResult,
} from "./remote-query-object-from-string"

type ExcludedProps = "__typename"

export type RemoteQueryFunctionReturnPagination = {
  skip: number
  take: number
  count: number
}

export type RemoteQueryReturnedData<TEntry extends string> =
  TEntry extends keyof RemoteQueryEntryPoints
    ? Prettify<Omit<RemoteQueryEntryPoints[TEntry], ExcludedProps>>
    : any

export type NarrowRemoteFunctionReturnType<
  TEntry extends string,
  TConfig extends RemoteQueryObjectConfig<TEntry>
> = TConfig extends { variables: infer Variables }
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

export type RemoteQueryFunctionReturnType<
  TEntry extends string,
  TConfig extends
    | RemoteQueryObjectConfig<TEntry>
    | RemoteQueryObjectFromStringResult<TEntry, any>
> = TConfig extends RemoteQueryObjectFromStringResult<
  TEntry,
  infer ResultTConfig
>
  ? NarrowRemoteFunctionReturnType<TEntry, ResultTConfig>
  : TConfig extends RemoteQueryObjectConfig<TEntry>
  ? NarrowRemoteFunctionReturnType<TEntry, TConfig>
  : never

export type RemoteQueryFunction = {
  /**
   * Query wrapper to provide specific API's and pre processing around remoteQuery.query
   * @param queryConfig
   * @param options
   */
  <
    const TEntry extends string,
    const TConfig extends RemoteQueryObjectConfig<TEntry>
  >(
    queryConfig: TConfig | RemoteQueryObjectConfig<TEntry>,
    options?: RemoteJoinerOptions
  ): Promise<RemoteQueryFunctionReturnType<TEntry, TConfig>>

  /**
   * Query wrapper to provide specific API's and pre processing around remoteQuery.query
   * @param queryConfig
   * @param options
   */
  <
    const TEntry extends string,
    const TConfig extends RemoteQueryObjectFromStringResult<TEntry, any>
  >(
    queryConfig: TConfig | RemoteQueryObjectFromStringResult<TEntry, any>,
    options?: RemoteJoinerOptions
  ): Promise<RemoteQueryFunctionReturnType<TEntry, TConfig>>
  /**
   * Query wrapper to provide specific API's and pre processing around remoteQuery.query
   * @param query
   * @param options
   */
  (query: RemoteJoinerQuery, options?: RemoteJoinerOptions): Promise<any>
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
