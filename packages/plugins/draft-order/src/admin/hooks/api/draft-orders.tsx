import { FetchError } from "@zjedene-medusa/js-sdk"
import { HttpTypes } from "@zjedene-medusa/types"
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query"
import { sdk } from "../../lib/queries/sdk"
import { ordersQueryKeys } from "./orders"
import { shippingOptionsQueryKeys } from "./shipping-options"
const DRAFT_ORDERS_QUERY_KEY = "draft-orders"

export const draftOrdersQueryKeys = {
  detail: (id: string, query?: Record<string, any>) => [
    DRAFT_ORDERS_QUERY_KEY,
    "details",
    id,
    query ? { query } : undefined,
  ],
  details: () => [DRAFT_ORDERS_QUERY_KEY, "details"],
  list: (query?: Record<string, any>) => [
    DRAFT_ORDERS_QUERY_KEY,
    "lists",
    query ? { query } : undefined,
  ],
  lists: () => [DRAFT_ORDERS_QUERY_KEY, "lists"],
}

export const useDraftOrders = (
  query?: HttpTypes.AdminOrderFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminDraftOrderListResponse,
      FetchError,
      HttpTypes.AdminDraftOrderListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      return await sdk.admin.draftOrder.list(query)
    },
    queryKey: draftOrdersQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useDraftOrder = (
  id: string,
  query?: HttpTypes.AdminDraftOrderParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminDraftOrderResponse,
      FetchError,
      HttpTypes.AdminDraftOrderResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      return await sdk.admin.draftOrder.retrieve(id, query)
    },
    queryKey: draftOrdersQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateDraftOrder = (
  options?: Omit<
    UseMutationOptions<
      HttpTypes.AdminDraftOrderResponse,
      FetchError,
      HttpTypes.AdminCreateDraftOrder
    >,
    "mutationFn" | "mutationKey"
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      return await sdk.admin.draftOrder.create(payload)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: draftOrdersQueryKeys.lists(),
      })

      // NOTE: Invalidate shipping options since we have a lot of places where we enable SO fetching
      // depending on a condition but RQ will return stale data from cache which will render wrong UI.
      queryClient.invalidateQueries({
        queryKey: shippingOptionsQueryKeys.list(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteDraftOrder = (
  options?: Omit<
    UseMutationOptions<
      HttpTypes.DeleteResponse<"draft-order">,
      FetchError,
      string
    >,
    "mutationFn" | "mutationKey"
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await sdk.admin.draftOrder.delete(id)
    },
    onSuccess: (data, undefined, context) => {
      queryClient.invalidateQueries({
        queryKey: draftOrdersQueryKeys.lists(),
      })

      options?.onSuccess?.(data, undefined, context)
    },
    ...options,
  })
}

export const useUpdateDraftOrder = (
  id: string,
  options?: Omit<
    UseMutationOptions<
      HttpTypes.AdminDraftOrderResponse,
      FetchError,
      HttpTypes.AdminUpdateDraftOrder
    >,
    "mutationFn" | "mutationKey"
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      return await sdk.admin.draftOrder.update(id, payload)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: draftOrdersQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: draftOrdersQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useConvertDraftOrder = (
  id: string,
  options?: UseMutationOptions<HttpTypes.AdminOrderResponse, FetchError, void>
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => sdk.admin.draftOrder.convertToOrder(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: draftOrdersQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: draftOrdersQueryKeys.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderAddItems = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    HttpTypes.AdminAddDraftOrderItems
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => sdk.admin.draftOrder.addItems(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderUpdateItem = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    HttpTypes.AdminUpdateDraftOrderItem & { item_id: string }
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ item_id, ...payload }) =>
      sdk.admin.draftOrder.updateItem(id, item_id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderRemoveActionItem = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    string
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (action_id: string) =>
      sdk.admin.draftOrder.removeActionItem(id, action_id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderUpdateActionItem = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    HttpTypes.AdminUpdateDraftOrderItem & { action_id: string }
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ action_id, ...payload }) =>
      sdk.admin.draftOrder.updateActionItem(id, action_id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderAddPromotions = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    HttpTypes.AdminAddDraftOrderPromotions
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => sdk.admin.draftOrder.addPromotions(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderRemovePromotions = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    HttpTypes.AdminRemoveDraftOrderPromotions
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => sdk.admin.draftOrder.removePromotions(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderAddShippingMethod = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    HttpTypes.AdminAddDraftOrderShippingMethod
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.draftOrder.addShippingMethod(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderUpdateActionShippingMethod = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    HttpTypes.AdminUpdateDraftOrderActionShippingMethod & { action_id: string }
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ action_id, ...payload }) =>
      sdk.admin.draftOrder.updateActionShippingMethod(id, action_id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderRemoveActionShippingMethod = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    string
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (action_id: string) =>
      sdk.admin.draftOrder.removeActionShippingMethod(id, action_id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderRemoveShippingMethod = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    string
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (shipping_method_id: string) =>
      sdk.admin.draftOrder.removeShippingMethod(id, shipping_method_id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderUpdateShippingMethod = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    HttpTypes.AdminUpdateDraftOrderShippingMethod & { method_id: string }
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ method_id, ...payload }) =>
      sdk.admin.draftOrder.updateShippingMethod(id, method_id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderBeginEdit = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    void
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => sdk.admin.draftOrder.beginEdit(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderCancelEdit = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.DeleteResponse<"draft-order-edit">,
    FetchError,
    void
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => sdk.admin.draftOrder.cancelEdit(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: draftOrdersQueryKeys.details(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderRequestEdit = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    void
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => sdk.admin.draftOrder.requestEdit(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDraftOrderConfirmEdit = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminDraftOrderPreviewResponse,
    FetchError,
    void
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => sdk.admin.draftOrder.confirmEdit(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(id),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(id),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: draftOrdersQueryKeys.detail(id),
      })

      queryClient.invalidateQueries({
        queryKey: draftOrdersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: draftOrdersQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
