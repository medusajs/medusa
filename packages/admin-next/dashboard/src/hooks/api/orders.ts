import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"

import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const ORDERS_QUERY_KEY = "orders" as const
export const ordersQueryKeys = queryKeysFactory(ORDERS_QUERY_KEY)

export const useOrder = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<any, Error, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => client.orders.retrieve(id, query),
    queryKey: ordersQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useOrders = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<any, Error, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => client.orders.list(query),
    queryKey: ordersQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
