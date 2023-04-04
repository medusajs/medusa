import {
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

export const useAdminCreateStockLocation = (
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
    buildOptions(queryClient, [adminStockLocationsKeys.lists()], options)
  )
}

export const useAdminUpdateStockLocation = (
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
      client.admin.stockLocations.update(id, payload),
    buildOptions(
      queryClient,
      [adminStockLocationsKeys.lists(), adminStockLocationsKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteStockLocation = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminStockLocationsDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.stockLocations.delete(id),
    buildOptions(
      queryClient,
      [
        adminStockLocationsKeys.lists(),
        adminStockLocationsKeys.detail(id),
        adminVariantKeys.all,
        adminProductKeys.lists(),
      ],
      options
    )
  )
}
