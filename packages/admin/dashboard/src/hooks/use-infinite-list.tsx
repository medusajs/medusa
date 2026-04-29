import { FetchError } from "@medusajs/js-sdk"
import { PaginatedResponse } from "@medusajs/types"
import {
  QueryKey,
  UseInfiniteQueryOptions,
  InfiniteData,
  useInfiniteQuery,
} from "@tanstack/react-query"

/**
 * Generic hook for infinite queries with pagination support.
 *
 * @template TResponse - The response type that must include count, offset, and limit
 * @template TParams - The query parameters type (offset and limit will be handled internally)
 * @template TError - The error type (defaults to FetchError)
 * @template TQueryKey - The query key type (defaults to QueryKey)
 *
 * @param config - Configuration object
 * @param config.queryKey - Function or array that generates the query key
 * @param config.queryFn - Function that fetches data with offset and limit
 * @param config.query - Query parameters (offset is ignored, limit is optional)
 * @param config.options - Additional options for useInfiniteQuery
 *
 * @example
 * ```ts
 * const { data, fetchNextPage, hasNextPage } = useInfiniteList({
 *   queryKey: (params) => productVariantQueryKeys.list(params),
 *   queryFn: async (params) => sdk.admin.productVariant.list(params),
 *   query: { status: "published" },
 * })
 * ```
 */
export const useInfiniteList = <
  TResponse extends PaginatedResponse<unknown>,
  TParams extends { offset?: number; limit?: number } = {
    offset?: number
    limit?: number
  },
  TError = FetchError,
  TQueryKey extends QueryKey = QueryKey
>({
  queryKey,
  queryFn,
  query,
  options,
}: {
  queryKey: ((params: Omit<TParams, "limit">) => TQueryKey) | TQueryKey
  queryFn: (params: TParams) => Promise<TResponse>
  query?: TParams
  options?: Omit<
    UseInfiniteQueryOptions<
      TResponse,
      TError,
      InfiniteData<TResponse, number>,
      TResponse,
      TQueryKey,
      number
    >,
    "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
  >
}) => {
  const { limit = 50, offset: _, ..._query } = query ?? {}
  const resolvedQueryKey =
    typeof queryKey === "function"
      ? queryKey(_query as Omit<TParams, "limit">)
      : queryKey
  const infiniteQueryKey =
    resolvedQueryKey[resolvedQueryKey.length - 1] === "__infinite"
      ? resolvedQueryKey
      : ([...resolvedQueryKey, "__infinite"] as unknown as TQueryKey)

  return useInfiniteQuery<
    TResponse,
    TError,
    InfiniteData<TResponse, number>,
    TQueryKey,
    number
  >({
    // Infinite queries must not share the exact same queryKey as non-infinite queries,
    // since the cached data shape differs (InfiniteData<T> vs T).
    queryKey: infiniteQueryKey,
    queryFn: ({ pageParam = 0 }) => {
      return queryFn({ ..._query, limit, offset: pageParam } as TParams)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const moreItemsExist = lastPage.count > lastPage.offset + lastPage.limit
      return moreItemsExist ? lastPage.offset + lastPage.limit : undefined
    },
    ...options,
  })
}
