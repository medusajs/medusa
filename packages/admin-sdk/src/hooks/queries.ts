import { Response } from "@medusajs/medusa-js"
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useMedusa } from "medusa-react"

interface Options<
  TQueryFn,
  Error,
  TData = TQueryFn,
  TQueryKey extends QueryKey = QueryKey
> extends UseQueryOptions<TQueryFn, Error, TData, TQueryKey> {
  endpoint: string
}

type UseQueryOptionsWrapper<
  // Return type of queryFn
  TQueryFn = unknown,
  // Type thrown in case the queryFn rejects
  E = Error,
  // Query key type
  TQueryKey extends QueryKey = QueryKey
> = Omit<Options<TQueryFn, E, TQueryFn, TQueryKey>, "queryFn">

export function useCustomListQuery<
  TQuery extends Record<string, unknown>,
  TRes extends Record<string, unknown>
>(
  query?: TQuery,
  options?: UseQueryOptionsWrapper<Response<TRes>, Error, QueryKey>
) {
  const { endpoint, ...opts } = options
  const { client } = useMedusa()

  const { data, ...rest } = useQuery(
    [endpoint, query],
    () => client.admin.custom.get<TQuery, TRes>(endpoint, query),
    opts
  )

  return { ...data, ...rest } as const
}

export function useCustomGetQuery<
  TQuery extends Record<string, unknown>,
  TRes extends Record<string, unknown>
>(
  identifier: string,
  query?: TQuery,
  options?: UseQueryOptionsWrapper<Response<TRes>, Error, QueryKey>
) {
  const { endpoint, ...opts } = options
  const { client } = useMedusa()

  const formattedEndpoint = endpoint.endsWith("/") ? endpoint : `${endpoint}/`
  const queryEndpoint = `${formattedEndpoint}${identifier}`

  const { data, ...rest } = useQuery(
    [identifier, query],
    () => client.admin.custom.get<TQuery, TRes>(queryEndpoint, query),
    opts
  )

  return { ...data, ...rest } as const
}
