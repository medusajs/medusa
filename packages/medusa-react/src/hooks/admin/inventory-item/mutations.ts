import {
  AdminInventoryItemsDeleteRes,
  AdminInventoryItemsRes,
  AdminPostInventoryItemsInventoryItemReq,
  AdminPostInventoryItemsItemLocationLevelsLevelReq,
  AdminPostInventoryItemsItemLocationLevelsReq,
  AdminPostInventoryItemsReq,
  AdminPostInventoryItemsParams
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

// inventory item

// create inventory item
export const useAdminCreateInventoryItem = (
  options?: UseMutationOptions<
    Response<AdminInventoryItemsRes>,
    Error,
    AdminPostInventoryItemsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostInventoryItemsReq, query?: AdminPostInventoryItemsParams) =>
      client.admin.inventoryItems.create(payload, query),
    buildOptions(
      queryClient,
      [adminInventoryItemsKeys.lists()],
      options
    )
  )
}


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
  options?: UseMutationOptions<
    Response<AdminInventoryItemsRes>,
    Error,
    AdminPostInventoryItemsItemLocationLevelsLevelReq & {
      stockLocationId: string
    }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (
      payload: AdminPostInventoryItemsItemLocationLevelsLevelReq & {
        stockLocationId: string
      }
    ) =>
      client.admin.inventoryItems.updateLocationLevel(
        inventoryItemId,
        payload.stockLocationId,
        {
          incoming_quantity: payload.incoming_quantity,
          stocked_quantity: payload.stocked_quantity,
        }
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
  options?: UseMutationOptions<Response<AdminInventoryItemsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (stockLocationId: string) =>
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
