import { useMutation, UseMutationOptions } from "@tanstack/react-query"

import { HttpTypes } from "@medusajs/types"

import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { ordersQueryKeys } from "./orders"
import { FetchError } from "@medusajs/js-sdk"
import { reservationItemsQueryKeys } from "./reservations"
import { inventoryItemsQueryKeys } from "./inventory.tsx"

export const useCreateOrderEdit = (
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    FetchError,
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
    FetchError,
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

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(id),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.lineItems(id),
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
    FetchError,
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

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(id),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.lineItems(id),
      })

      queryClient.invalidateQueries({
        queryKey: reservationItemsQueryKeys.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.details(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCancelOrderEdit = (
  orderId: string,
  options?: UseMutationOptions<any, FetchError, any>
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

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(orderId),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.lineItems(id),
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
    FetchError,
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
    FetchError,
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
    FetchError,
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
    FetchError,
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
