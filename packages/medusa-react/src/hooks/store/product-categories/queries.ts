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

/**
 * This hook retrieves a list of product categories. The product categories can be filtered by fields such as `handle` or `q` passed in the `query` parameter.
 * The product categories can also be paginated. This hook can also be used to retrieve a product category by its handle.
 *
 * @example
 * To list product categories:
 *
 * ```tsx
 * import React from "react"
 * import { useProductCategories } from "medusa-react"
 *
 * function Categories() {
 *   const {
 *     product_categories,
 *     isLoading,
 *   } = useProductCategories()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_categories && !product_categories.length && (
 *         <span>No Categories</span>
 *       )}
 *       {product_categories && product_categories.length > 0 && (
 *         <ul>
 *           {product_categories.map(
 *             (category) => (
 *               <li key={category.id}>{category.name}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Categories
 * ```
 *
 * To retrieve a product category by its handle:
 *
 * ```tsx
 * import React from "react"
 * import { useProductCategories } from "medusa-react"
 *
 * function Categories(
 *   handle: string
 * ) {
 *   const {
 *     product_categories,
 *     isLoading,
 *   } = useProductCategories({
 *     handle
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_categories && !product_categories.length && (
 *         <span>No Categories</span>
 *       )}
 *       {product_categories && product_categories.length > 0 && (
 *         <ul>
 *           {product_categories.map(
 *             (category) => (
 *               <li key={category.id}>{category.name}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Categories
 * ```
 *
 * To specify relations that should be retrieved within the product categories:
 *
 * ```tsx
 * import React from "react"
 * import { useProductCategories } from "medusa-react"
 *
 * function Categories(
 *   handle: string
 * ) {
 *   const {
 *     product_categories,
 *     isLoading,
 *   } = useProductCategories({
 *     handle,
 *     expand: "products"
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_categories && !product_categories.length && (
 *         <span>No Categories</span>
 *       )}
 *       {product_categories && product_categories.length > 0 && (
 *         <ul>
 *           {product_categories.map(
 *             (category) => (
 *               <li key={category.id}>{category.name}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Categories
 * ```
 *
 * By default, only the first `100` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import { useProductCategories } from "medusa-react"
 *
 * function Categories(
 *   handle: string
 * ) {
 *   const {
 *     product_categories,
 *     limit,
 *     offset,
 *     isLoading,
 *   } = useProductCategories({
 *     handle,
 *     expand: "products",
 *     limit: 50,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_categories && !product_categories.length && (
 *         <span>No Categories</span>
 *       )}
 *       {product_categories && product_categories.length > 0 && (
 *         <ul>
 *           {product_categories.map(
 *             (category) => (
 *               <li key={category.id}>{category.name}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Categories
 * ```
 *
 * @customNamespace Hooks.Store.Product Categories
 * @category Queries
 */
export const useProductCategories = (
  /**
   * Filters and pagination configurations to apply on the retrieved product categories.
   */
  query?: StoreGetProductCategoriesParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreGetProductCategoriesRes>,
    Error,
    ReturnType<ProductCategoryQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeProductCategoryKeys.list(query),
    queryFn: () => client.productCategories.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a Product Category's details.
 *
 * @example
 * A simple example that retrieves a product category by its ID:
 *
 * ```tsx
 * import React from "react"
 * import { useProductCategory } from "medusa-react"
 *
 * type Props = {
 *   categoryId: string
 * }
 *
 * const Category = ({ categoryId }: Props) => {
 *   const { product_category, isLoading } = useProductCategory(
 *     categoryId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_category && <span>{product_category.name}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Category
 * ```
 *
 * To specify relations that should be retrieved:
 *
 * ```tsx
 * import React from "react"
 * import { useProductCategory } from "medusa-react"
 *
 * type Props = {
 *   categoryId: string
 * }
 *
 * const Category = ({ categoryId }: Props) => {
 *   const { product_category, isLoading } = useProductCategory(
 *     categoryId,
 *     {
 *       expand: "products"
 *     }
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_category && <span>{product_category.name}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Category
 * ```
 *
 * @customNamespace Hooks.Store.Product Categories
 * @category Queries
 */
export const useProductCategory = (
  /**
   * The product category's ID.
   */
  id: string,
  /**
   * Configurations to apply on the retrieved product categories.
   */
  query?: StoreGetProductCategoriesCategoryParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreGetProductCategoriesCategoryRes>,
    Error,
    ReturnType<ProductCategoryQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeProductCategoryKeys.detail(id),
    queryFn: () => client.productCategories.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest } as const
}
