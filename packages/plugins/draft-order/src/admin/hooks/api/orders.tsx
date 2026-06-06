import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query"

import { FetchError } from "@zjedene-medusa/js-sdk"
import { HttpTypes } from "@zjedene-medusa/types"
import { UseMutationOptions } from "@tanstack/react-query"

import {
  AdminOrderEditAddShippingMethod,
  AdminOrderEditUpdateShippingMethod,
} from "../../../types/http/orders/requests"
import { sdk } from "../../lib/queries/sdk"
import { draftOrdersQueryKeys } from "./draft-orders"

const ORDERS_QUERY_KEY = "orders"

export const ordersQueryKeys = {
  detail: (id: string, query?: Record<string, any>) => [
    ORDERS_QUERY_KEY,
    "details",
    id,
    query ? { query } : undefined,
  ],
  details: () => [ORDERS_QUERY_KEY, "details"],
  list: (query?: Record<string, any>) => [
    ORDERS_QUERY_KEY,
    "lists",
    query ? { query } : undefined,
  ],
  lists: () => [ORDERS_QUERY_KEY, "lists"],
  preview: (id: string) => [ORDERS_QUERY_KEY, "preview", id],
  changes: (id: string) => [ORDERS_QUERY_KEY, "changes", id],
}

export const useOrder = (
  id: string,
  query?: HttpTypes.AdminOrderFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminOrderResponse,
      FetchError,
      HttpTypes.AdminOrderResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: ordersQueryKeys.detail(id, query),
    queryFn: async () => sdk.admin.order.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useOrderChanges = (
  id: string,
  query?: HttpTypes.AdminOrderChangesFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.PaginatedResponse<HttpTypes.AdminOrderChangesResponse>,
      FetchError,
      HttpTypes.PaginatedResponse<HttpTypes.AdminOrderChangesResponse>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.order.listChanges(id, query),
    queryKey: ordersQueryKeys.changes(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateOrder = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderResponse,
    FetchError,
    HttpTypes.AdminUpdateOrder
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => sdk.admin.order.update(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(id),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useOrderPreview = (
  id: string,
  query?: HttpTypes.AdminOrderFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminOrderPreviewResponse,
      FetchError,
      HttpTypes.AdminOrderPreviewResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.order.retrievePreview(id, query),
    queryKey: ordersQueryKeys.preview(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useOrderEditCreate = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditResponse,
    FetchError,
    HttpTypes.AdminInitiateOrderEditRequest
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => sdk.admin.orderEdit.initiateRequest(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useOrderEditCancel = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditDeleteResponse,
    FetchError,
    void
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => await sdk.admin.orderEdit.cancelRequest(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useOrderEditRequest = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    FetchError,
    void
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => sdk.admin.orderEdit.request(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useOrderEditConfirm = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    FetchError,
    void
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => sdk.admin.orderEdit.confirm(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: draftOrdersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useOrderEditAddItems = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    FetchError,
    HttpTypes.AdminAddOrderEditItems
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: HttpTypes.AdminAddOrderEditItems) =>
      sdk.admin.orderEdit.addItems(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useOrderEditAddShippingMethod = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    FetchError,
    AdminOrderEditAddShippingMethod
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => {
      return sdk.client.fetch(`/admin/order-edits/${id}/shipping-method`, {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useOrderEditDeleteShippingMethod = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    FetchError,
    string
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (action_id: string) => {
      return sdk.client.fetch(
        `/admin/order-edits/${id}/shipping-method/${action_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      ) as Promise<HttpTypes.AdminOrderEditPreviewResponse>
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useOrderEditUpdateShippingMethod = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    FetchError,
    AdminOrderEditUpdateShippingMethod & { action_id: string }
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ action_id, ...payload }) => {
      return sdk.client.fetch(
        `/admin/order-edits/${id}/shipping-method/${action_id}`,
        {
          method: "POST",
          body: payload,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useOrderEditUpdateActionItem = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    FetchError,
    HttpTypes.AdminUpdateOrderEditItem & {
      action_id: string
      unit_price?: number | null
      compare_at_unit_price?: number | null
    }
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ action_id, ...payload }) => {
      return sdk.admin.orderEdit.updateAddedItem(id, action_id, payload)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useOrderEditUpdateOriginalItem = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    FetchError,
    HttpTypes.AdminUpdateOrderEditItem & {
      item_id: string
      unit_price?: number | null
      compare_at_unit_price?: number | null
    }
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ item_id, ...payload }) => {
      return sdk.admin.orderEdit.updateOriginalItem(id, item_id, payload)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useOrderEditRemoveActionItem = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderEditPreviewResponse,
    FetchError,
    string
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (action_id: string) =>
      sdk.admin.orderEdit.removeAddedItem(id, action_id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
