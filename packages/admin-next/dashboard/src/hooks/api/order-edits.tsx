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
  options?: UseMutationOptions<
    HttpTypes.AdminOrderResponse,
    Error,
    HttpTypes.AdminInitiateOrderEditRequest
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminInitiateOrderEditRequest) =>
      sdk.admin.orderEdit.initiateRequest(payload),
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

export const useAddOrderEditItems = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    Error,
    HttpTypes.AdminAddOrderEditItems
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminAddOrderEditItems) =>
      sdk.admin.orderEdit.addItems(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
