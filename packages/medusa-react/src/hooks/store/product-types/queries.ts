import {
  StoreGetProductTypesParams,
  StoreProductTypesListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const PRODUCT_TYPES_QUERY_KEY = `product_types` as const

export const productTypeKeys = queryKeysFactory(PRODUCT_TYPES_QUERY_KEY)

type ProductTypesQueryKeys = typeof productTypeKeys

/**
 * This hook retrieves a list of product types. The product types can be filtered by fields such as `value` or `q` passed
 * in the `query` parameter. The product types can also be sorted or paginated.
 *
 * @example
 * To list product types:
 *
 * ```tsx
 * import React from "react"
 * import { useProductTypes } from "medusa-react"
 *
 * function Types() {
 *   const {
 *     product_types,
 *     isLoading,
 *   } = useProductTypes()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_types && !product_types.length && (
 *         <span>No Product Types</span>
 *       )}
 *       {product_types && product_types.length > 0 && (
 *         <ul>
 *           {product_types.map(
 *             (type) => (
 *               <li key={type.id}>{type.value}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Types
 * ```
 *
 * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useProductTypes } from "medusa-react"
 *
 * function Types() {
 *   const {
 *     product_types,
 *     limit,
 *     offset,
 *     isLoading,
 *   } = useProductTypes({
 *     limit: 10,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_types && !product_types.length && (
 *         <span>No Product Types</span>
 *       )}
 *       {product_types && product_types.length > 0 && (
 *         <ul>
 *           {product_types.map(
 *             (type) => (
 *               <li key={type.id}>{type.value}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Types
 * ```
 *
 * @customNamespace Hooks.Store.Product Types
 * @category Queries
 */
export const useProductTypes = (
  /**
   * Filters and pagination configurations to apply on retrieved product types.
   */
  query?: StoreGetProductTypesParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreProductTypesListRes>,
    Error,
    ReturnType<ProductTypesQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryFn: () => client.productTypes.list(query),
    queryKey: productTypeKeys.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}
