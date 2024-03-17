import {
  AdminPostStockLocationsLocationReq,
  AdminPostStockLocationsReq,
  AdminStockLocationsDeleteRes,
  AdminStockLocationsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminProductKeys } from "../products"
import { adminVariantKeys } from "../variants"
import { adminStockLocationsKeys } from "./queries"

/**
 * This hook creates a stock location.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateStockLocation } from "medusa-react"
 *
 * const CreateStockLocation = () => {
 *   const createStockLocation = useAdminCreateStockLocation()
 *   // ...
 *
 *   const handleCreate = (name: string) => {
 *     createStockLocation.mutate({
 *       name,
 *     }, {
 *       onSuccess: ({ stock_location }) => {
 *         console.log(stock_location.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateStockLocation
 *
 * @customNamespace Hooks.Admin.Stock Locations
 * @category Mutations
 */
export const useAdminCreateStockLocation = (
  options?: UseMutationOptions<
    Response<AdminStockLocationsRes>,
    Error,
    AdminPostStockLocationsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostStockLocationsReq) =>
      client.admin.stockLocations.create(payload),
    ...buildOptions(queryClient, [adminStockLocationsKeys.lists()], options),
  })
}

/**
 * This hook updates a stock location's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateStockLocation } from "medusa-react"
 *
 * type Props = {
 *   stockLocationId: string
 * }
 *
 * const StockLocation = ({ stockLocationId }: Props) => {
 *   const updateLocation = useAdminUpdateStockLocation(
 *     stockLocationId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     name: string
 *   ) => {
 *     updateLocation.mutate({
 *       name
 *     }, {
 *       onSuccess: ({ stock_location }) => {
 *         console.log(stock_location.name)
 *       }
 *     })
 *   }
 * }
 *
 * export default StockLocation
 *
 * @customNamespace Hooks.Admin.Stock Locations
 * @category Mutations
 */
export const useAdminUpdateStockLocation = (
  /**
   * The stock location's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminStockLocationsRes>,
    Error,
    AdminPostStockLocationsLocationReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostStockLocationsLocationReq) =>
      client.admin.stockLocations.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminStockLocationsKeys.lists(), adminStockLocationsKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook deletes a stock location.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteStockLocation } from "medusa-react"
 *
 * type Props = {
 *   stockLocationId: string
 * }
 *
 * const StockLocation = ({ stockLocationId }: Props) => {
 *   const deleteLocation = useAdminDeleteStockLocation(
 *     stockLocationId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteLocation.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 * }
 *
 * export default StockLocation
 *
 * @customNamespace Hooks.Admin.Stock Locations
 * @category Mutations
 */
export const useAdminDeleteStockLocation = (
  /**
   * The stock location's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminStockLocationsDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.stockLocations.delete(id),
    ...buildOptions(
      queryClient,
      [
        adminStockLocationsKeys.lists(),
        adminStockLocationsKeys.detail(id),
        adminVariantKeys.all,
        adminProductKeys.lists(),
      ],
      options
    ),
  })
}
