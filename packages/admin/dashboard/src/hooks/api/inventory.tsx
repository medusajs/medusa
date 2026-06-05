import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"

import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { variantsQueryKeys } from "./products"

const INVENTORY_ITEMS_QUERY_KEY = "inventory_items" as const
export const inventoryItemsQueryKeys = queryKeysFactory(
  INVENTORY_ITEMS_QUERY_KEY
)

const INVENTORY_ITEM_LEVELS_QUERY_KEY = "inventory_item_levels" as const
export const inventoryItemLevelsQueryKeys = queryKeysFactory(
  INVENTORY_ITEM_LEVELS_QUERY_KEY
)

export const useInventoryItems = (
  query?: HttpTypes.AdminInventoryItemsParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminInventoryItemListResponse,
      FetchError,
      HttpTypes.AdminInventoryItemListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.inventoryItem.list(query),
    queryKey: inventoryItemsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useInventoryItem = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminInventoryItemResponse,
      FetchError,
      HttpTypes.AdminInventoryItemResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.inventoryItem.retrieve(id, query),
    queryKey: inventoryItemsQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateInventoryItem = (
  options?: UseMutationOptions<
    HttpTypes.AdminInventoryItemResponse,
    FetchError,
    HttpTypes.AdminCreateInventoryItem
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminCreateInventoryItem) =>
      sdk.admin.inventoryItem.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateInventoryItem = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminInventoryItemResponse,
    FetchError,
    HttpTypes.AdminUpdateInventoryItem
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminUpdateInventoryItem) =>
      sdk.admin.inventoryItem.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.detail(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteInventoryItem = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminInventoryItemDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.inventoryItem.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.detail(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteInventoryItemLevel = (
  inventoryItemId: string,
  locationId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminInventoryLevelDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () =>
      sdk.admin.inventoryItem.deleteLevel(inventoryItemId, locationId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.detail(inventoryItemId),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemLevelsQueryKeys.detail(inventoryItemId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useInventoryItemLevels = (
  inventoryItemId: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminInventoryLevelListResponse,
      FetchError,
      HttpTypes.AdminInventoryLevelListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.inventoryItem.listLevels(inventoryItemId, query),
    queryKey: inventoryItemLevelsQueryKeys.list({
      ...(query || {}),
      inventoryItemId,
    }),
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateInventoryLevel = (
  inventoryItemId: string,
  locationId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminInventoryItemResponse,
    FetchError,
    HttpTypes.AdminUpdateInventoryLevel
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminUpdateInventoryLevel) =>
      sdk.admin.inventoryItem.updateLevel(inventoryItemId, locationId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.detail(inventoryItemId),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemLevelsQueryKeys.detail(inventoryItemId),
      })
      queryClient.invalidateQueries({
        queryKey: variantsQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useBatchInventoryItemLocationLevels = (
  inventoryItemId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminBatchInventoryItemLocationLevelsResponse,
    FetchError,
    HttpTypes.AdminBatchInventoryItemLocationLevels
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.inventoryItem.batchInventoryItemLocationLevels(
        inventoryItemId,
        payload
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.detail(inventoryItemId),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemLevelsQueryKeys.detail(inventoryItemId),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemLevelsQueryKeys.list({ inventoryItemId }),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useBatchInventoryItemsLocationLevels = (
  options?: UseMutationOptions<
    HttpTypes.AdminBatchInventoryItemsLocationLevelsResponse,
    FetchError,
    HttpTypes.AdminBatchInventoryItemsLocationLevels
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.inventoryItem.batchInventoryItemsLocationLevels(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: variantsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
