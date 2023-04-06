import {
  AdminDeletePriceListPricesPricesReq,
  AdminPostPriceListPricesPricesReq,
  AdminPostPriceListsPriceListPriceListReq,
  AdminPostPriceListsPriceListReq,
  AdminPriceListDeleteBatchRes,
  AdminPriceListDeleteProductPricesRes,
  AdminPriceListDeleteRes,
  AdminPriceListDeleteVariantPricesRes,
  AdminPriceListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminProductKeys } from "../products"
import { adminVariantKeys } from "../variants"
import { adminPriceListKeys } from "./queries"

export const useAdminCreatePriceList = (
  options?: UseMutationOptions<
    Response<AdminPriceListRes>,
    Error,
    AdminPostPriceListsPriceListReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostPriceListsPriceListReq) =>
      client.admin.priceLists.create(payload),
    buildOptions(queryClient, adminPriceListKeys.lists(), options)
  )
}

export const useAdminUpdatePriceList = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminPriceListRes>,
    Error,
    AdminPostPriceListsPriceListPriceListReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostPriceListsPriceListPriceListReq) =>
      client.admin.priceLists.update(id, payload),
    buildOptions(
      queryClient,
      [
        adminPriceListKeys.detail(id),
        adminPriceListKeys.lists(),
        adminPriceListKeys.detailProducts(id),
      ],
      options
    )
  )
}

export const useAdminDeletePriceList = (
  id: string,
  options?: UseMutationOptions<Response<AdminPriceListDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.priceLists.delete(id),
    buildOptions(
      queryClient,
      [adminPriceListKeys.detail(id), adminPriceListKeys.lists()],
      options
    )
  )
}

export const useAdminCreatePriceListPrices = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminPriceListRes>,
    Error,
    AdminPostPriceListPricesPricesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostPriceListPricesPricesReq) =>
      client.admin.priceLists.addPrices(id, payload),
    buildOptions(
      queryClient,
      [adminPriceListKeys.lists(), adminPriceListKeys.detailProducts(id)],
      options
    )
  )
}

export const useAdminDeletePriceListPrices = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminPriceListDeleteBatchRes>,
    Error,
    AdminDeletePriceListPricesPricesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminDeletePriceListPricesPricesReq) =>
      client.admin.priceLists.deletePrices(id, payload),
    buildOptions(
      queryClient,
      [
        adminPriceListKeys.detail(id),
        adminPriceListKeys.lists(),
        adminPriceListKeys.detailProducts(id),
      ],
      options
    )
  )
}

export const useAdminDeletePriceListProductPrices = (
  id: string,
  productId: string,
  options?: UseMutationOptions<
    Response<AdminPriceListDeleteProductPricesRes>,
    Error
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.priceLists.deleteProductPrices(id, productId),
    buildOptions(
      queryClient,
      [
        adminPriceListKeys.detail(id),
        adminPriceListKeys.lists(),
        adminProductKeys.detail(productId),
      ],
      options
    )
  )
}

export const useAdminDeletePriceListVariantPrices = (
  id: string,
  variantId: string,
  options?: UseMutationOptions<
    Response<AdminPriceListDeleteVariantPricesRes>,
    Error
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.priceLists.deleteVariantPrices(id, variantId),
    buildOptions(
      queryClient,
      [
        adminPriceListKeys.detail(id),
        adminPriceListKeys.lists(),
        adminVariantKeys.detail(variantId),
      ],
      options
    )
  )
}
