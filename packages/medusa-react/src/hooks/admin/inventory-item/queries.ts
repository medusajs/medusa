import {
  AdminGetInventoryItemsItemLocationLevelsParams,
  AdminGetInventoryItemsParams,
  AdminGetStockLocationsParams,
  AdminInventoryItemsListWithVariantsAndLocationLevelsRes,
  AdminInventoryItemsLocationLevelsRes,
  AdminInventoryItemsRes,
} from "@medusajs/medusa"

import { Response } from "@medusajs/medusa-js"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"
import { useMedusa } from "../../../contexts"
import { useQuery } from "@tanstack/react-query"

const ADMIN_INVENTORY_ITEMS_QUERY_KEY = `admin_inventory_items` as const

export const adminInventoryItemsKeys = queryKeysFactory(
  ADMIN_INVENTORY_ITEMS_QUERY_KEY
)

type InventoryItemsQueryKeys = typeof adminInventoryItemsKeys

/**
 * This hook retrieves a list of inventory items. The inventory items can be filtered by fields such as `q` or `location_id` passed in the `query` parameter.
 * The inventory items can also be paginated.
 *
 * @example
 * To list inventory items:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminInventoryItems } from "medusa-react"
 *
 * function InventoryItems() {
 *   const {
 *     inventory_items,
 *     isLoading
 *   } = useAdminInventoryItems()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {inventory_items && !inventory_items.length && (
 *         <span>No Items</span>
 *       )}
 *       {inventory_items && inventory_items.length > 0 && (
 *         <ul>
 *           {inventory_items.map(
 *             (item) => (
 *               <li key={item.id}>{item.id}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default InventoryItems
 * ```
 *
 * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminInventoryItems } from "medusa-react"
 *
 * function InventoryItems() {
 *   const {
 *     inventory_items,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminInventoryItems({
 *     limit: 10,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {inventory_items && !inventory_items.length && (
 *         <span>No Items</span>
 *       )}
 *       {inventory_items && inventory_items.length > 0 && (
 *         <ul>
 *           {inventory_items.map(
 *             (item) => (
 *               <li key={item.id}>{item.id}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default InventoryItems
 * ```
 *
 * @customNamespace Hooks.Admin.Inventory Items
 * @category Queries
 */
export const useAdminInventoryItems = (
  /**
   * Filters and pagination configurations applied on the retrieved inventory items.
   */
  query?: AdminGetInventoryItemsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminInventoryItemsListWithVariantsAndLocationLevelsRes>,
    Error,
    ReturnType<InventoryItemsQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery({
    queryKey: adminInventoryItemsKeys.list(query),
    queryFn: () => client.admin.inventoryItems.list(query),
    ...options,
  })

  return { ...data, ...rest } as const
}

/**
 * This hook retrieves an Inventory Item's details.
 *
 * @example
 * import React from "react"
 * import { useAdminInventoryItem } from "medusa-react"
 *
 * type Props = {
 *   inventoryItemId: string
 * }
 *
 * const InventoryItem = ({ inventoryItemId }: Props) => {
 *   const {
 *     inventory_item,
 *     isLoading
 *   } = useAdminInventoryItem(inventoryItemId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {inventory_item && (
 *         <span>{inventory_item.sku}</span>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default InventoryItem
 *
 * @customNamespace Hooks.Admin.Inventory Items
 * @category Queries
 */
export const useAdminInventoryItem = (
  /**
   * The inventory item's ID.
   */
  inventoryItemId: string,
  /**
   * Configurations applied on the retrieved inventory item.
   */
  query?: AdminGetStockLocationsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminInventoryItemsRes>,
    Error,
    ReturnType<InventoryItemsQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery({
    queryKey: adminInventoryItemsKeys.detail(inventoryItemId),
    queryFn: () => client.admin.inventoryItems.retrieve(inventoryItemId, query),
    ...options,
  })

  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a list of inventory levels of an inventory item. The inventory levels can be filtered by fields
 * such as `location_id` passed in the `query` parameter.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminInventoryItemLocationLevels,
 * } from "medusa-react"
 *
 * type Props = {
 *   inventoryItemId: string
 * }
 *
 * const InventoryItem = ({ inventoryItemId }: Props) => {
 *   const {
 *     inventory_item,
 *     isLoading,
 *   } = useAdminInventoryItemLocationLevels(inventoryItemId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {inventory_item && (
 *         <ul>
 *           {inventory_item.location_levels.map((level) => (
 *             <span key={level.id}>{level.stocked_quantity}</span>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default InventoryItem
 *
 * @customNamespace Hooks.Admin.Inventory Items
 * @category Queries
 */
export const useAdminInventoryItemLocationLevels = (
  /**
   * The ID of the inventory item that the location levels belong to.
   */
  inventoryItemId: string,
  /**
   * Filters to apply on the retrieved location levels.
   */
  query?: AdminGetInventoryItemsItemLocationLevelsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminInventoryItemsLocationLevelsRes>,
    Error,
    ReturnType<InventoryItemsQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery({
    queryKey: adminInventoryItemsKeys.detail(inventoryItemId),
    queryFn: () =>
      client.admin.inventoryItems.listLocationLevels(inventoryItemId, query),
    ...options,
  })

  return { ...data, ...rest } as const
}
