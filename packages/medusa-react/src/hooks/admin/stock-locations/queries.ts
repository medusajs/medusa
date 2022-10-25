import {
  AdminInventoryItemsRes,
  AdminInventoryItemsListRes,
  AdminGetInventoryItemsParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_INVENTORY_ITEMS_QUERY_KEY = `admin_inventory_items` as const

export const adminInventoryItemsKeys = queryKeysFactory(
  ADMIN_INVENTORY_ITEMS_QUERY_KEY
)

type InventoryItemsQueryKeys = typeof adminInventoryItemsKeys

/** retrieve a sales channel
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable feature flag `sales_channels` in your medusa backend project.
 * @description gets a sales channel
 * @returns a medusa sales channel
 */
export const useAdminInventoryItem = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminInventoryItemsRes>,
    Error,
    ReturnType<InventoryItemsQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminInventoryItemsKeys.detail(id),
    () => client.admin.inventoryItems.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}

/**
 * retrieve a list of sales channels
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable feature flag `sales_channels` in your medusa backend project.
 * @description Retrieve a list of sales channel
 * @returns a list of sales channel as well as the pagination properties
 */
export const useAdminInventoryItems = (
  query?: AdminGetInventoryItemsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminInventoryItemsListRes>,
    Error,
    ReturnType<InventoryItemsQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminInventoryItemsKeys.list(query),
    () => client.admin.inventoryItems.list(query),
    options
  )
  return { ...data, ...rest } as const
}
