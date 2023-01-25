import {
  AdminInventoryItemsDeleteRes,
  AdminInventoryItemsRes,
  AdminPostInventoryItemsInventoryItemReq,
  AdminPostInventoryItemsItemLocationLevelsLevelReq,
  AdminPostInventoryItemsItemLocationLevelsReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js/dist/index"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminInventoryItemsKeys } from "./queries"

// inventory item

// update inventory item
export const useAdminUpdateInventoryItem = (
  inventoryItemId: string,
  options?: UseMutationOptions<
    Response<AdminInventoryItemsRes>,
    Error,
    AdminPostInventoryItemsInventoryItemReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostInventoryItemsInventoryItemReq) =>
      client.admin.inventoryItems.update(inventoryItemId, payload),
    buildOptions(
      queryClient,
      [adminInventoryItemsKeys.detail(inventoryItemId)],
      options
    )
  )
}

// delete inventory item
export const useAdminDeleteInventoryItem = (
  inventoryItemId: string,
  options?: UseMutationOptions<
    Response<AdminInventoryItemsDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.inventoryItems.delete(inventoryItemId),
    buildOptions(
      queryClient,
      [adminInventoryItemsKeys.detail(inventoryItemId)],
      options
    )
  )
}

// location level
export const useAdminUpdateLocationLevel = (
  inventoryItemId: string,
  stockLocationId: string,
  options?: UseMutationOptions<
    Response<AdminInventoryItemsRes>,
    Error,
    AdminPostInventoryItemsItemLocationLevelsLevelReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostInventoryItemsItemLocationLevelsLevelReq) =>
      client.admin.inventoryItems.updateLocationLevel(
        inventoryItemId,
        stockLocationId,
        payload
      ),
    buildOptions(
      queryClient,
      [
        adminInventoryItemsKeys.detail(inventoryItemId),
        adminInventoryItemsKeys.lists(),
      ],
      options
    )
  )
}

export const useAdminDeleteLocationLevel = (
  inventoryItemId: string,
  stockLocationId: string,
  options?: UseMutationOptions<Response<AdminInventoryItemsRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () =>
      client.admin.inventoryItems.deleteLocationLevel(
        inventoryItemId,
        stockLocationId
      ),
    buildOptions(
      queryClient,
      [
        adminInventoryItemsKeys.detail(inventoryItemId),
        adminInventoryItemsKeys.lists(),
      ],
      options
    )
  )
}

export const useAdminCreateLocationLevel = (
  inventoryItemId: string,
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
      client.admin.inventoryItems.createLocationLevel(inventoryItemId, payload),
    buildOptions(
      queryClient,
      [
        adminInventoryItemsKeys.detail(inventoryItemId),
        adminInventoryItemsKeys.lists(),
      ],
      options
    )
  )
}
