import {
  AdminInventoryItemsRes,
  AdminPostInventoryItemsItemReq,
  AdminPostInventoryItemsItemLocationLevelsReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminInventoryItemsKeys } from "./queries"

/** update an InventoryItem
 * @experimental This feature is under development and may change in the future.
 * To use this feature please install @medusajs/inventory
 * @description updates an InventoryItem
 * @returns the updated Medusa InventoryItem
 */
export const useAdminUpdateInventoryItem = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminInventoryItemsRes>,
    Error,
    AdminPostInventoryItemsItemReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostInventoryItemsItemReq) =>
      client.admin.inventoryItems.update(id, payload),
    buildOptions(
      queryClient,
      [adminInventoryItemsKeys.lists(), adminInventoryItemsKeys.detail(id)],
      options
    )
  )
}

/** update an InventoryItem
 * @experimental This feature is under development and may change in the future.
 * To use this feature please install @medusajs/inventory
 * @description updates an InventoryItem
 * @returns the updated Medusa InventoryItem
 */
export const useAdminCreateInventoryItemLocationLevel = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminInventoryItemsRes>,
    Error,
    AdminPostInventoryItemsItemLocationLevelsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostInventoryItemsItemLocationLevelsReq) =>
      client.admin.inventoryItems.createInventoryLevel(id, payload),
    buildOptions(
      queryClient,
      [adminInventoryItemsKeys.lists(), adminInventoryItemsKeys.detail(id)],
      options
    )
  )
}
