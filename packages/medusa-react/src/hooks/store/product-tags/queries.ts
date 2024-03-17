import {
  StoreGetProductTagsParams,
  StoreProductTagsListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const PRODUCT_TAGS_QUERY_KEY = `product_tags` as const

export const productTagKeys = queryKeysFactory(PRODUCT_TAGS_QUERY_KEY)

type ProductTypesQueryKeys = typeof productTagKeys

/**
 * This hook retrieves a list of product tags. The product tags can be filtered by fields such as `id` or `q`
 * passed in the `query` parameter. The product tags can also be sorted or paginated.
 *
 * @example
 * To list product tags:
 *
 * ```tsx
 * import React from "react"
 * import { useProductTags } from "medusa-react"
 *
 * function Tags() {
 *   const {
 *     product_tags,
 *     isLoading,
 *   } = useProductTags()
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
 * export default Tags
 * ```
 *
 * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useProductTags } from "medusa-react"
 *
 * function Tags() {
 *   const {
 *     product_tags,
 *     limit,
 *     offset,
 *     isLoading,
 *   } = useProductTags({
 *     limit: 10,
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
 * export default Tags
 * ```
 *
 * @customNamespace Hooks.Store.Product Tags
 * @category Queries
 */
export const useProductTags = (
  /**
   * Filters and pagination configurations to apply on the retrieved product tags.
   */
  query?: StoreGetProductTagsParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreProductTagsListRes>,
    Error,
    ReturnType<ProductTypesQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: productTagKeys.list(query),
    queryFn: () => client.productTags.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}
