import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"

import { HttpTypes } from "@medusajs/types"

import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { ordersQueryKeys } from "./orders"

export const useCreateOrderEdit = (
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderResponse,
    Error,
    HttpTypes.AdminCreateOrderFulfillment
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminCreateOrderFulfillment) =>
      sdk.admin.orderEdit.create(orderId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCancelOrderEdit = (
  orderId: string,
  options?: UseMutationOptions<any, Error, any>
) => {
  return useMutation({
    mutationFn: (payload: { no_notification?: boolean }) =>
      sdk.admin.order.cancel(orderId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
