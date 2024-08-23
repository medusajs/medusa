import { useMutation, UseMutationOptions } from "@tanstack/react-query"

import { HttpTypes } from "@medusajs/types"

import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { ordersQueryKeys } from "./orders"

export const useCreateOrderEdit = (
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
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

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useRequestOrderEdit = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    Error,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.orderEdit.request(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useConfirmOrderEdit = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    Error,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.orderEdit.confirm(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
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
    mutationFn: () => sdk.admin.orderEdit.cancelRequest(orderId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
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

/**
 * Update (quantity) of an item that was originally on the order.
 */
export const useUpdateOrderEditOriginalItem = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    Error,
    HttpTypes.AdminUpdateOrderEditItem & { itemId: string }
  >
) => {
  return useMutation({
    mutationFn: ({
      itemId,
      ...payload
    }: HttpTypes.AdminUpdateOrderEditItem & { itemId: string }) => {
      return sdk.admin.orderEdit.updateOriginalItem(id, itemId, payload)
    },
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Update (quantity) of an item that was added to the order edit.
 */
export const useUpdateOrderEditAddedItem = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    Error,
    HttpTypes.AdminUpdateOrderEditItem & { actionId: string }
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminUpdateOrderEditItem & { actionId: string }) => {
      return sdk.admin.orderEdit.updateAddedItem(id, actionId, payload)
    },
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Remove item that was added to the edit.
 * To remove an original item on the order, set quantity to 0.
 */
export const useRemoveOrderEditItem = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    Error,
    string
  >
) => {
  return useMutation({
    mutationFn: (actionId: string) =>
      sdk.admin.orderEdit.removeAddedItem(id, actionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
