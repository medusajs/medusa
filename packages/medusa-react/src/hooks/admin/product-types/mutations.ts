import {
  AdminProductTypesDeleteRes,
  AdminProductTypesRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { adminProductTypeKeys } from "."
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import {
  CreateProductType,
  UpdateProductType,
} from "@medusajs/medusa/dist/types/product-type"

export const useAdminCreateProductType = (
  options?: UseMutationOptions<
    Response<AdminProductTypesRes>,
    Error,
    CreateProductType
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: CreateProductType) => client.admin.productTypes.create(payload),
    buildOptions(queryClient, adminProductTypeKeys.lists(), options)
  )
}

export const useAdminUpdateProductType = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminProductTypesRes>,
    Error,
    UpdateProductType
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: UpdateProductType) =>
      client.admin.productTypes.update(id, payload),
    buildOptions(
      queryClient,
      [adminProductTypeKeys.lists(), adminProductTypeKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteProductType = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminProductTypesDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    () => client.admin.productTypes.delete(id),
    buildOptions(
      queryClient,
      [adminProductTypeKeys.lists(), adminProductTypeKeys.detail(id)],
      options
    )
  )
}
