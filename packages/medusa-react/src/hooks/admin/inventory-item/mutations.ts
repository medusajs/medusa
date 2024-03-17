import {
  AdminInventoryItemsDeleteRes,
  AdminInventoryItemsRes,
  AdminPostInventoryItemsInventoryItemReq,
  AdminPostInventoryItemsItemLocationLevelsLevelReq,
  AdminPostInventoryItemsItemLocationLevelsReq,
  AdminPostInventoryItemsReq,
  AdminPostInventoryItemsParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminInventoryItemsKeys } from "./queries"

/**
 * This hook creates an Inventory Item for a product variant.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateInventoryItem } from "medusa-react"
 *
 * const CreateInventoryItem = () => {
 *   const createInventoryItem = useAdminCreateInventoryItem()
 *   // ...
 *
 *   const handleCreate = (variantId: string) => {
 *     createInventoryItem.mutate({
 *       variant_id: variantId,
 *     }, {
 *       onSuccess: ({ inventory_item }) => {
 *         console.log(inventory_item.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateInventoryItem
 *
 * @customNamespace Hooks.Admin.Inventory Items
 * @category Mutations
 */
export const useAdminCreateInventoryItem = (
  options?: UseMutationOptions<
    Response<AdminInventoryItemsRes>,
    Error,
    AdminPostInventoryItemsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      payload: AdminPostInventoryItemsReq,
      query?: AdminPostInventoryItemsParams
    ) => client.admin.inventoryItems.create(payload, query),
    ...buildOptions(queryClient, [adminInventoryItemsKeys.lists()], options),
  })
}

/**
 * This hook updates an Inventory Item's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateInventoryItem } from "medusa-react"
 *
 * type Props = {
 *   inventoryItemId: string
 * }
 *
 * const InventoryItem = ({ inventoryItemId }: Props) => {
 *   const updateInventoryItem = useAdminUpdateInventoryItem(
 *     inventoryItemId
 *   )
 *   // ...
 *
 *   const handleUpdate = (origin_country: string) => {
 *     updateInventoryItem.mutate({
 *       origin_country,
 *     }, {
 *       onSuccess: ({ inventory_item }) => {
 *         console.log(inventory_item.origin_country)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default InventoryItem
 *
 * @customNamespace Hooks.Admin.Inventory Items
 * @category Mutations
 */
export const useAdminUpdateInventoryItem = (
  /**
   * The inventory item's ID.
   */
  inventoryItemId: string,
  options?: UseMutationOptions<
    Response<AdminInventoryItemsRes>,
    Error,
    AdminPostInventoryItemsInventoryItemReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostInventoryItemsInventoryItemReq) =>
      client.admin.inventoryItems.update(inventoryItemId, payload),
    ...buildOptions(
      queryClient,
      [
        adminInventoryItemsKeys.lists(),
        adminInventoryItemsKeys.detail(inventoryItemId),
      ],
      options
    ),
  })
}

/**
 * This hook deletes an Inventory Item. This does not delete the associated product variant.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteInventoryItem } from "medusa-react"
 *
 * type Props = {
 *   inventoryItemId: string
 * }
 *
 * const InventoryItem = ({ inventoryItemId }: Props) => {
 *   const deleteInventoryItem = useAdminDeleteInventoryItem(
 *     inventoryItemId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteInventoryItem.mutate()
 *   }
 *
 *   // ...
 * }
 *
 * export default InventoryItem
 *
 * @customNamespace Hooks.Admin.Inventory Items
 * @category Mutations
 */
export const useAdminDeleteInventoryItem = (
  /**
   * The inventory item's ID.
   */
  inventoryItemId: string,
  options?: UseMutationOptions<
    Response<AdminInventoryItemsDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.inventoryItems.delete(inventoryItemId),
    ...buildOptions(
      queryClient,
      [
        adminInventoryItemsKeys.lists(),
        adminInventoryItemsKeys.detail(inventoryItemId),
      ],
      options
    ),
  })
}

export type AdminUpdateLocationLevelReq =
  AdminPostInventoryItemsItemLocationLevelsLevelReq & {
    /**
     * The ID of the location level to update.
     */
    stockLocationId: string
  }

/**
 * This hook updates a location level's details for a given inventory item.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateLocationLevel } from "medusa-react"
 *
 * type Props = {
 *   inventoryItemId: string
 * }
 *
 * const InventoryItem = ({ inventoryItemId }: Props) => {
 *   const updateLocationLevel = useAdminUpdateLocationLevel(
 *     inventoryItemId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     stockLocationId: string,
 *     stockedQuantity: number
 *   ) => {
 *     updateLocationLevel.mutate({
 *       stockLocationId,
 *       stocked_quantity: stockedQuantity,
 *     }, {
 *       onSuccess: ({ inventory_item }) => {
 *         console.log(inventory_item.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default InventoryItem
 *
 * @customNamespace Hooks.Admin.Inventory Items
 * @category Mutations
 */
export const useAdminUpdateLocationLevel = (
  /**
   * The inventory item's ID.
   */
  inventoryItemId: string,
  options?: UseMutationOptions<
    Response<AdminInventoryItemsRes>,
    Error,
    AdminUpdateLocationLevelReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminUpdateLocationLevelReq) =>
      client.admin.inventoryItems.updateLocationLevel(
        inventoryItemId,
        payload.stockLocationId,
        {
          incoming_quantity: payload.incoming_quantity,
          stocked_quantity: payload.stocked_quantity,
        }
      ),
    ...buildOptions(
      queryClient,
      [
        adminInventoryItemsKeys.detail(inventoryItemId),
        adminInventoryItemsKeys.lists(),
      ],
      options
    ),
  })
}

/**
 * This hook deletes a location level of an Inventory Item.
 *
 * @typeParamDefinition string - The ID of the location level to delete.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteLocationLevel } from "medusa-react"
 *
 * type Props = {
 *   inventoryItemId: string
 * }
 *
 * const InventoryItem = ({ inventoryItemId }: Props) => {
 *   const deleteLocationLevel = useAdminDeleteLocationLevel(
 *     inventoryItemId
 *   )
 *   // ...
 *
 *   const handleDelete = (
 *     locationId: string
 *   ) => {
 *     deleteLocationLevel.mutate(locationId)
 *   }
 *
 *   // ...
 * }
 *
 * export default InventoryItem
 *
 * @customNamespace Hooks.Admin.Inventory Items
 * @category Mutations
 */
export const useAdminDeleteLocationLevel = (
  /**
   * The inventory item's ID.
   */
  inventoryItemId: string,
  options?: UseMutationOptions<Response<AdminInventoryItemsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (stockLocationId: string) =>
      client.admin.inventoryItems.deleteLocationLevel(
        inventoryItemId,
        stockLocationId
      ),
    ...buildOptions(
      queryClient,
      [
        adminInventoryItemsKeys.detail(inventoryItemId),
        adminInventoryItemsKeys.lists(),
      ],
      options
    ),
  })
}

/**
 * This hook creates a Location Level for a given Inventory Item.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateLocationLevel } from "medusa-react"
 *
 * type Props = {
 *   inventoryItemId: string
 * }
 *
 * const InventoryItem = ({ inventoryItemId }: Props) => {
 *   const createLocationLevel = useAdminCreateLocationLevel(
 *     inventoryItemId
 *   )
 *   // ...
 *
 *   const handleCreateLocationLevel = (
 *     locationId: string,
 *     stockedQuantity: number
 *   ) => {
 *     createLocationLevel.mutate({
 *       location_id: locationId,
 *       stocked_quantity: stockedQuantity,
 *     }, {
 *       onSuccess: ({ inventory_item }) => {
 *         console.log(inventory_item.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default InventoryItem
 *
 * @customNamespace Hooks.Admin.Inventory Items
 * @category Mutations
 */
export const useAdminCreateLocationLevel = (
  /**
   * The inventory item's ID.
   */
  inventoryItemId: string,
  options?: UseMutationOptions<
    Response<AdminInventoryItemsRes>,
    Error,
    AdminPostInventoryItemsItemLocationLevelsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostInventoryItemsItemLocationLevelsReq) =>
      client.admin.inventoryItems.createLocationLevel(inventoryItemId, payload),
    ...buildOptions(
      queryClient,
      [
        adminInventoryItemsKeys.detail(inventoryItemId),
        adminInventoryItemsKeys.lists(),
      ],
      options
    ),
  })
}
