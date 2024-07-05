import { AdminInventoryItemResponse, InventoryNext } from "@medusajs/types"
import {
  InventoryItemDeleteRes,
  InventoryItemListRes,
  InventoryItemLocationLevelsRes,
  InventoryItemRes,
} from "../../types/api-responses"
import {
  InventoryItemLocationBatch,
  UpdateInventoryItemReq,
  UpdateInventoryLevelReq,
} from "../../types/api-payloads"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"

import { client } from "../../lib/client"
import { queryClient } from "../../lib/medusa"
import { queryKeysFactory } from "../../lib/query-key-factory"

const INVENTORY_ITEMS_QUERY_KEY = "inventory_items" as const
export const inventoryItemsQueryKeys = queryKeysFactory(
  INVENTORY_ITEMS_QUERY_KEY
)

const INVENTORY_ITEM_LEVELS_QUERY_KEY = "inventory_item_levels" as const
export const inventoryItemLevelsQueryKeys = queryKeysFactory(
  INVENTORY_ITEM_LEVELS_QUERY_KEY
)

export const useInventoryItems = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      InventoryItemListRes,
      Error,
      InventoryItemListRes,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.inventoryItems.list(query),
    queryKey: inventoryItemsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useInventoryItem = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<InventoryItemRes, Error, InventoryItemRes, QueryKey>,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.inventoryItems.retrieve(id, query),
    queryKey: inventoryItemsQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateInventoryItem = (
  id: string,
  options?: UseMutationOptions<InventoryItemRes, Error, UpdateInventoryItemReq>
) => {
  return useMutation({
    mutationFn: (payload: InventoryNext.UpdateInventoryItemInput) =>
      client.inventoryItems.update(id, payload),
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
  options?: UseMutationOptions<InventoryItemDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.inventoryItems.delete(id),
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
  options?: UseMutationOptions<InventoryItemDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () =>
      client.inventoryItems.deleteInventoryItemLevel(
        inventoryItemId,
        locationId
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
      InventoryItemLocationLevelsRes,
      Error,
      InventoryItemLocationLevelsRes,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () =>
      client.inventoryItems.listLocationLevels(inventoryItemId, query),
    queryKey: inventoryItemLevelsQueryKeys.detail(inventoryItemId),
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateInventoryItemLevel = (
  inventoryItemId: string,
  locationId: string,
  options?: UseMutationOptions<
    AdminInventoryItemResponse,
    Error,
    UpdateInventoryLevelReq
  >
) => {
  return useMutation({
    mutationFn: (payload: UpdateInventoryLevelReq) =>
      client.inventoryItems.updateInventoryLevel(
        inventoryItemId,
        locationId,
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
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useBatchInventoryItemLevels = (
  inventoryItemId: string,
  options?: UseMutationOptions<
    InventoryItemLocationLevelsRes,
    Error,
    InventoryItemLocationBatch
  >
) => {
  return useMutation({
    mutationFn: (payload: InventoryItemLocationBatch) =>
      client.inventoryItems.batchPostLocationLevels(inventoryItemId, payload),
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
