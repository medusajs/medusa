import {
  AdminPostProductsProductOptionsOption,
  AdminPostProductsProductOptionsReq,
  AdminPostProductsProductReq,
  AdminPostProductsProductVariantsReq,
  AdminPostProductsProductVariantsVariantReq,
  AdminPostProductsReq,
  AdminProductsDeleteOptionRes,
  AdminProductsDeleteRes,
  AdminProductsDeleteVariantRes,
  AdminProductsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminProductKeys } from "./queries"

export const useAdminCreateProduct = (
  options?: UseMutationOptions<
    Response<AdminProductsRes>,
    Error,
    AdminPostProductsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostProductsReq) => client.admin.products.create(payload),
    buildOptions(queryClient, adminProductKeys.lists(), options)
  )
}

export const useAdminUpdateProduct = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminProductsRes>,
    Error,
    AdminPostProductsProductReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostProductsProductReq) =>
      client.admin.products.update(id, payload),
    buildOptions(
      queryClient,
      [adminProductKeys.lists(), adminProductKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteProduct = (
  id: string,
  options?: UseMutationOptions<Response<AdminProductsDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.products.delete(id),
    buildOptions(
      queryClient,
      [adminProductKeys.lists(), adminProductKeys.detail(id)],
      options
    )
  )
}

export const useAdminCreateVariant = (
  productId: string,
  options?: UseMutationOptions<
    Response<AdminProductsRes>,
    Error,
    AdminPostProductsProductVariantsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostProductsProductVariantsReq) =>
      client.admin.products.createVariant(productId, payload),
    buildOptions(
      queryClient,
      [adminProductKeys.lists(), adminProductKeys.detail(productId)],
      options
    )
  )
}

export const useAdminUpdateVariant = (
  productId: string,
  options?: UseMutationOptions<
    Response<AdminProductsRes>,
    Error,
    AdminPostProductsProductVariantsVariantReq & { variant_id: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      variant_id,
      ...payload
    }: AdminPostProductsProductVariantsVariantReq & { variant_id: string }) =>
      client.admin.products.updateVariant(productId, variant_id, payload),
    buildOptions(
      queryClient,
      [adminProductKeys.lists(), adminProductKeys.detail(productId)],
      options
    )
  )
}

export const useAdminDeleteVariant = (
  productId: string,
  options?: UseMutationOptions<
    Response<AdminProductsDeleteVariantRes>,
    Error,
    string
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (variantId: string) =>
      client.admin.products.deleteVariant(productId, variantId),
    buildOptions(
      queryClient,
      [adminProductKeys.lists(), adminProductKeys.detail(productId)],
      options
    )
  )
}

export const useAdminCreateProductOption = (
  productId: string,
  options?: UseMutationOptions<
    Response<AdminProductsRes>,
    Error,
    AdminPostProductsProductOptionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostProductsProductOptionsReq) =>
      client.admin.products.addOption(productId, payload),
    buildOptions(queryClient, adminProductKeys.detail(productId), options)
  )
}

export const useAdminUpdateProductOption = (
  productId: string,
  options?: UseMutationOptions<
    Response<AdminProductsRes>,
    Error,
    AdminPostProductsProductOptionsOption & { option_id: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      option_id,
      ...payload
    }: AdminPostProductsProductOptionsOption & { option_id: string }) =>
      client.admin.products.updateOption(productId, option_id, payload),
    buildOptions(queryClient, adminProductKeys.detail(productId), options)
  )
}

export const useAdminDeleteProductOption = (
  productId: string,
  options?: UseMutationOptions<
    Response<AdminProductsDeleteOptionRes>,
    Error,
    string
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (optionId: string) =>
      client.admin.products.deleteOption(productId, optionId),
    buildOptions(queryClient, adminProductKeys.detail(productId), options)
  )
}
