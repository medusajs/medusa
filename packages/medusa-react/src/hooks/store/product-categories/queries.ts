import {
  StoreGetProductCategoriesParams,
  StoreGetProductCategoriesRes,
  StoreGetProductCategoriesCategoryParams,
  StoreGetProductCategoriesCategoryRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"

import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const STORE_PRODUCT_CATEGORIES_QUERY_KEY = `product_categories` as const
export const storeProductCategoryKeys = queryKeysFactory(
  STORE_PRODUCT_CATEGORIES_QUERY_KEY
)
type ProductCategoryQueryKeys = typeof storeProductCategoryKeys

export const useStoreProductCategories = (
  query?: StoreGetProductCategoriesParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreGetProductCategoriesRes>,
    Error,
    ReturnType<ProductCategoryQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    storeProductCategoryKeys.list(query),
    () => client.store.productCategories.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useStoreProductCategory = (
  id: string,
  query?: StoreGetProductCategoriesCategoryParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreGetProductCategoriesCategoryRes>,
    Error,
    ReturnType<ProductCategoryQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    storeProductCategoryKeys.detail(id),
    () => client.store.productCategories.retrieve(id, query),
    options
  )

  return { ...data, ...rest } as const
}
