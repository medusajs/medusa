import {
  AdminGetProductTypesParams,
  AdminProductTypesListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_PRODUCT_TYPES_QUERY_KEY = `admin_product_types` as const

export const adminProductTypeKeys = queryKeysFactory(
  ADMIN_PRODUCT_TYPES_QUERY_KEY
)

type ProductTypesQueryKeys = typeof adminProductTypeKeys

/**
 * This hook retrieves a list of product types. The product types can be filtered by fields such as `q` or `value` passed in the `query` parameter.
 * The product types can also be sorted or paginated.
 *
 * @example
 * To list product types:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminProductTypes } from "medusa-react"
 *
 * function ProductTypes() {
 *   const {
 *     product_types,
 *     isLoading
 *   } = useAdminProductTypes()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_types && !product_types.length && (
 *         <span>No Product Tags</span>
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
 * export default ProductTypes
 * ```
 *
 * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminProductTypes } from "medusa-react"
 *
 * function ProductTypes() {
 *   const {
 *     product_types,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminProductTypes({
 *     limit: 10,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product_types && !product_types.length && (
 *         <span>No Product Tags</span>
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
 * export default ProductTypes
 * ```
 *
 * @customNamespace Hooks.Admin.Product Types
 * @category Queries
 */
export const useAdminProductTypes = (
  /**
   * Filters and pagination configurations to apply on the retrieved product types.
   */
  query?: AdminGetProductTypesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductTypesListRes>,
    Error,
    ReturnType<ProductTypesQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminProductTypeKeys.list(query),
    queryFn: () => client.admin.productTypes.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}
