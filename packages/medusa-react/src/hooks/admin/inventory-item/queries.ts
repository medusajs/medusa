import {
  AdminGetStockLocationsParams,
  AdminInventoryItemsListWithVariantsAndLocationLevelsRes,
  AdminInventoryItemsLocationLevelsRes,
  AdminInventoryItemsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_INVENTORY_ITEMS_QUERY_KEY = `admin_inventory_items` as const

export const adminInventoryItemsKeys = queryKeysFactory(
  ADMIN_INVENTORY_ITEMS_QUERY_KEY
)

type InventoryItemsQueryKeys = typeof adminInventoryItemsKeys

export const useAdminInventoryItems = (
  query?: AdminGetStockLocationsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminInventoryItemsListWithVariantsAndLocationLevelsRes>,
    Error,
    ReturnType<InventoryItemsQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery(
    adminInventoryItemsKeys.list(query),
    () => client.admin.inventoryItems.list(query),
    { ...options }
  )

  return { ...data, ...rest } as const
}

export const useAdminInventoryItem = (
  inventoryItemId: string,
  query?: AdminGetStockLocationsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminInventoryItemsRes>,
    Error,
    ReturnType<InventoryItemsQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery(
    adminInventoryItemsKeys.detail(inventoryItemId),
    () => client.admin.inventoryItems.retrieve(inventoryItemId, query),
    { ...options }
  )

  return { ...data, ...rest } as const
}

export const useAdminInventoryItemLocationLevels = (
  inventoryItemId: string,
  query?: AdminGetStockLocationsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminInventoryItemsLocationLevelsRes>,
    Error,
    ReturnType<InventoryItemsQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery(
    adminInventoryItemsKeys.detail(inventoryItemId),
    () =>
      client.admin.inventoryItems.listLocationLevels(inventoryItemId, query),
    { ...options }
  )

  return { ...data, ...rest } as const
}
