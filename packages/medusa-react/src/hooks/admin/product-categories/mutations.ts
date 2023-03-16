import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { Response } from "@medusajs/medusa-js"
import {
  AdminDeleteProductCategoriesCategoryProductsBatchReq,
  AdminPostProductCategoriesCategoryProductsBatchReq,
  AdminPostProductCategoriesCategoryReq,
  AdminPostProductCategoriesReq,
  AdminProductCategoriesCategoryDeleteRes,
  AdminProductCategoriesCategoryRes,
} from "@medusajs/medusa"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminProductCategoryKeys } from "./queries"
import { adminProductKeys } from "../products"

/**
 * Hook provides a mutation function for creating product categories.
 *
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable the corresponding feature flag in your medusa backend project.
 */
export const useAdminCreateProductCategory = (
  options?: UseMutationOptions<
    Response<AdminProductCategoriesCategoryRes>,
    Error,
    AdminPostProductCategoriesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostProductCategoriesReq) =>
      client.admin.productCategories.create(payload),
    buildOptions(
      queryClient,
      [adminProductCategoryKeys.list(), adminProductKeys.details()],
      options
    )
  )
}

/** Update a product category
 *
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable feature flag `product_categories` in your medusa backend project.
 * @description updates a product category
 * @returns the updated medusa product category
 */
export const useAdminUpdateProductCategory = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminProductCategoriesCategoryRes>,
    Error,
    AdminPostProductCategoriesCategoryReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostProductCategoriesCategoryReq) =>
      client.admin.productCategories.update(id, payload),
      buildOptions(
        queryClient,
        [
          adminProductCategoryKeys.lists(),
          adminProductCategoryKeys.detail(id),
          adminProductKeys.details(),
        ],
        options
      )
    )
}

/**
 * Delete a product category
 *
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable featureflag `product_categories` in your medusa backend project.
 * @param id
 * @param options
 */
export const useAdminDeleteProductCategory = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminProductCategoriesCategoryDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.productCategories.delete(id),
    buildOptions(
      queryClient,
      [
        adminProductCategoryKeys.lists(),
        adminProductCategoryKeys.detail(id),
        adminProductKeys.all
      ],
      options
    )
  )
}

/**
 * Add products to a product category
 *
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable featureflag `product_categories` in your medusa backend project.
 * @description Add products to a product category
 * @param id
 * @param options
 */
export const useAdminAddProductsToCategory = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminProductCategoriesCategoryRes>,
    Error,
    AdminPostProductCategoriesCategoryProductsBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostProductCategoriesCategoryProductsBatchReq) => {
      return client.admin.productCategories.addProducts(id, payload)
    },
    buildOptions(
      queryClient,
      [
        adminProductCategoryKeys.lists(),
        adminProductCategoryKeys.detail(id),
        adminProductKeys.list({ product_category_id: [id] }),
      ],
      options
    )
  )
}

/**
 * Remove products from a product category
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable featureflag `product_categories` in your medusa backend project.
 * @description remove products from a product category
 * @param id
 * @param options
 */
export const useAdminDeleteProductsFromCategory = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminProductCategoriesCategoryRes>,
    Error,
    AdminDeleteProductCategoriesCategoryProductsBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminDeleteProductCategoriesCategoryProductsBatchReq) => {
      return client.admin.productCategories.removeProducts(id, payload)
    },
    buildOptions(
      queryClient,
      [
        adminProductCategoryKeys.lists(),
        adminProductCategoryKeys.detail(id),
        adminProductKeys.list({ product_category_id: [id] }),
      ],
      options
    )
  )
}
