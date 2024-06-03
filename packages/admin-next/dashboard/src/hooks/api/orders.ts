import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"

import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { client } from "../../lib/client"

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

export const useCreateOrderFulfillment = (
  orderId: string,
  options?: UseMutationOptions<any, Error, any>
) => {
  return useMutation({
    mutationFn: (payload: any) =>
      client.orders.createFulfillment(orderId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCancelOrderFulfillment = (
  orderId: string,
  fulfillmentId: string,
  options?: UseMutationOptions<any, Error, any>
) => {
  return useMutation({
    mutationFn: () => client.orders.cancelFulfillment(orderId, fulfillmentId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
