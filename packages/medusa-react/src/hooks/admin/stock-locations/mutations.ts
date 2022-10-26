import {
  AdminStockLocationsRes,
  AdminPostStockLocationsReq,
  AdminPostStockLocationsLocationReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminStockLocationsKeys } from "./queries"

/** create a StockLocation
 * @experimental This feature is under development and may change in the future.
 * To use this feature please install @medusajs/inventory
 * @description updates an StockLocation
 * @returns the updated Medusa StockLocation
 */
export const useAdminCreateStockLocation = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminStockLocationsRes>,
    Error,
    AdminPostStockLocationsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostStockLocationsReq) =>
      client.admin.stockLocations.create(payload),
    buildOptions(
      queryClient,
      [adminStockLocationsKeys.lists(), adminStockLocationsKeys.detail(id)],
      options
    )
  )
}

/** update a StockLocation
 * @experimental This feature is under development and may change in the future.
 * To use this feature please install @medusajs/inventory
 * @description updates an StockLocation
 * @returns the updated Medusa StockLocation
 */
export const useAdminUpdateStockLocation = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminStockLocationsRes>,
    Error,
    AdminPostStockLocationsLocationReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostStockLocationsLocationReq) =>
      client.admin.stockLocations.update(id, payload),
    buildOptions(
      queryClient,
      [adminStockLocationsKeys.lists(), adminStockLocationsKeys.detail(id)],
      options
    )
  )
}
