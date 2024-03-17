import {
  AdminGetProductTagsParams,
  AdminProductTagsListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_PRODUCT_TAGS_QUERY_KEY = `admin_product_tags` as const

export const adminProductTagKeys = queryKeysFactory(
  ADMIN_PRODUCT_TAGS_QUERY_KEY
)

type ProductQueryKeys = typeof adminProductTagKeys

/**
 * This hook retrieves a list of product tags. The product tags can be filtered by fields such as `q` or `value` passed
 * in the `query` parameter. The product tags can also be sorted or paginated.
 *
 * @example
 * To list product tags:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminProductTags } from "medusa-react"
 *
 * function ProductTags() {
 *   const {
 *     product_tags,
 *     isLoading
 *   } = useAdminProductTags()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_tags && !product_tags.length && (
 *         <span>No Product Tags</span>
 *       )}
 *       {product_tags && product_tags.length > 0 && (
 *         <ul>
 *           {product_tags.map(
 *             (tag) => (
 *               <li key={tag.id}>{tag.value}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default ProductTags
 * ```
 *
 * By default, only the first `10` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminProductTags } from "medusa-react"
 *
 * function ProductTags() {
 *   const {
 *     product_tags,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminProductTags({
 *     limit: 20,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_tags && !product_tags.length && (
 *         <span>No Product Tags</span>
 *       )}
 *       {product_tags && product_tags.length > 0 && (
 *         <ul>
 *           {product_tags.map(
 *             (tag) => (
 *               <li key={tag.id}>{tag.value}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default ProductTags
 * ```
 *
 * @customNamespace Hooks.Admin.Product Tags
 * @category Queries
 */
export const useAdminProductTags = (
  /**
   * Filters and pagination configurations to apply on the retrieved product tags.
   */
  query?: AdminGetProductTagsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductTagsListRes>,
    Error,
    ReturnType<ProductQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminProductTagKeys.list(query),
    queryFn: () => client.admin.productTags.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}
