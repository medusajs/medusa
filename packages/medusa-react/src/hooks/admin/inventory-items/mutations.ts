import {
  AdminInventoryItemsRes,
  AdminPostInventoryItemsItemReq,
  AdminPostInventoryItemsItemLocationLevelsReq,
  AdminPostInventoryItemsItemLocationLevelsLevelReq,
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
      client.admin.inventoryItems.createLocationLevel(id, payload),
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
export const useAdminDeleteInventoryItemLocationLevel = (
  id: string,
  options?: UseMutationOptions<Response<AdminInventoryItemsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (locationId: string) =>
      client.admin.inventoryItems.deleteLocationLevel(id, locationId),
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
export const useAdminUpdateInventoryItemLocationLevel = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminInventoryItemsRes>,
    Error,
    AdminPostInventoryItemsItemLocationLevelsLevelReq & { locationId: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (
      payload: AdminPostInventoryItemsItemLocationLevelsLevelReq & {
        locationId: string
      }
    ) => {
      const { locationId, ...rest } = payload
      return client.admin.inventoryItems.updateLocationLevel(
        id,
        locationId,
        rest
      )
    },
    buildOptions(
      queryClient,
      [adminInventoryItemsKeys.lists(), adminInventoryItemsKeys.detail(id)],
      options
    )
  )
}
