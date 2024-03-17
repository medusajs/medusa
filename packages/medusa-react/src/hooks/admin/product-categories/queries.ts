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

/**
 * This hook
 *
 * @example
 * To list product categories:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminProductCategories } from "medusa-react"
 *
 * function Categories() {
 *   const {
 *     product_categories,
 *     isLoading
 *   } = useAdminProductCategories()
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
 * To specify relations that should be retrieved within the product category:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminProductCategories } from "medusa-react"
 *
 * function Categories() {
 *   const {
 *     product_categories,
 *     isLoading
 *   } = useAdminProductCategories({
 *     expand: "category_children"
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
 * import React from "react"
 * import { useAdminProductCategories } from "medusa-react"
 *
 * function Categories() {
 *   const {
 *     product_categories,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminProductCategories({
 *     expand: "category_children",
 *     limit: 20,
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
 * @customNamespace Hooks.Admin.Product Categories
 * @category Queries
 */
export const useAdminProductCategories = (
  /**
   * Filters and pagination configurations to apply on the retrieved product categories.
   */
  query?: AdminGetProductCategoriesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductCategoriesListRes>,
    Error,
    ReturnType<ProductCategoryQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminProductCategoryKeys.list(query),
    queryFn: () => client.admin.productCategories.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a product category's details.
 *
 * @example
 * A simple example that retrieves an order by its ID:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminProductCategory } from "medusa-react"
 *
 * type Props = {
 *   productCategoryId: string
 * }
 *
 * const Category = ({
 *   productCategoryId
 * }: Props) => {
 *   const {
 *     product_category,
 *     isLoading,
 *   } = useAdminProductCategory(productCategoryId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_category && (
 *         <span>{product_category.name}</span>
 *       )}
 *
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
 * import { useAdminProductCategory } from "medusa-react"
 *
 * type Props = {
 *   productCategoryId: string
 * }
 *
 * const Category = ({
 *   productCategoryId
 * }: Props) => {
 *   const {
 *     product_category,
 *     isLoading,
 *   } = useAdminProductCategory(productCategoryId, {
 *     expand: "category_children"
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_category && (
 *         <span>{product_category.name}</span>
 *       )}
 *
 *     </div>
 *   )
 * }
 *
 * export default Category
 * ```
 *
 * @customNamespace Hooks.Admin.Product Categories
 * @category Queries
 */
export const useAdminProductCategory = (
  /**
   * The product category's ID.
   */
  id: string,
  /**
   * Configurations to apply on the retrieved product category.
   */
  query?: AdminGetProductCategoryParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductCategoriesCategoryRes>,
    Error,
    ReturnType<ProductCategoryQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminProductCategoryKeys.detail(id),
    queryFn: () => client.admin.productCategories.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest } as const
}
