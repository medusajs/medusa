import {
  AdminGetProductCategoriesParams,
  AdminProductCategoriesListRes,
  AdminGetProductCategoryParams,
  AdminProductCategoriesCategoryRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"

import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_PRODUCT_CATEGORIES_QUERY_KEY = `product_categories` as const
export const adminProductCategoryKeys = queryKeysFactory(
  ADMIN_PRODUCT_CATEGORIES_QUERY_KEY
)
type ProductCategoryQueryKeys = typeof adminProductCategoryKeys

export const useAdminProductCategories = (
  query?: AdminGetProductCategoriesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductCategoriesListRes>,
    Error,
    ReturnType<ProductCategoryQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductCategoryKeys.list(query),
    () => client.admin.productCategories.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminProductCategory = (
  id: string,
  query?: AdminGetProductCategoryParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductCategoriesCategoryRes>,
    Error,
    ReturnType<ProductCategoryQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductCategoryKeys.detail(id),
    () => client.admin.productCategories.retrieve(id, query),
    options
  )

  return { ...data, ...rest } as const
}
