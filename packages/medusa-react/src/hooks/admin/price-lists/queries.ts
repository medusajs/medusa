import {
  AdminGetPriceListPaginationParams,
  AdminGetPriceListsPriceListProductsParams,
  AdminPriceListRes,
  AdminPriceListsListRes,
  AdminProductsListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_PRICE_LISTS_QUERY_KEY = `admin_price_lists` as const

export const adminPriceListKeys = {
  ...queryKeysFactory(ADMIN_PRICE_LISTS_QUERY_KEY),
  detailProducts(id: string, query?: any) {
    return [
      ...this.detail(id),
      "products" as const,
      { ...(query || {}) },
    ] as const
  },
}

type PriceListQueryKeys = typeof adminPriceListKeys

/**
 * This hook retrieves a list of price lists. The price lists can be filtered by fields such as `q` or `status` passed
 * in the `query` parameter. The price lists can also be sorted or paginated.
 *
 * @example
 * To list price lists:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminPriceLists } from "medusa-react"
 *
 * const PriceLists = () => {
 *   const { price_lists, isLoading } = useAdminPriceLists()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {price_lists && !price_lists.length && (
 *         <span>No Price Lists</span>
 *       )}
 *       {price_lists && price_lists.length > 0 && (
 *         <ul>
 *           {price_lists.map((price_list) => (
 *             <li key={price_list.id}>{price_list.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default PriceLists
 * ```
 *
 * To specify relations that should be retrieved within the price lists:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminPriceLists } from "medusa-react"
 *
 * const PriceLists = () => {
 *   const { price_lists, isLoading } = useAdminPriceLists({
 *     expand: "prices"
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {price_lists && !price_lists.length && (
 *         <span>No Price Lists</span>
 *       )}
 *       {price_lists && price_lists.length > 0 && (
 *         <ul>
 *           {price_lists.map((price_list) => (
 *             <li key={price_list.id}>{price_list.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default PriceLists
 * ```
 *
 * By default, only the first `10` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminPriceLists } from "medusa-react"
 *
 * const PriceLists = () => {
 *   const {
 *     price_lists,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminPriceLists({
 *     expand: "prices",
 *     limit: 20,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {price_lists && !price_lists.length && (
 *         <span>No Price Lists</span>
 *       )}
 *       {price_lists && price_lists.length > 0 && (
 *         <ul>
 *           {price_lists.map((price_list) => (
 *             <li key={price_list.id}>{price_list.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default PriceLists
 * ```
 *
 * @customNamespace Hooks.Admin.Price Lists
 * @category Queries
 */
export const useAdminPriceLists = (
  /**
   * Filters and pagination configurations to apply on the retrieved price lists.
   */
  query?: AdminGetPriceListPaginationParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminPriceListsListRes>,
    Error,
    ReturnType<PriceListQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminPriceListKeys.list(query),
    queryFn: () => client.admin.priceLists.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a price list's products. The products can be filtered by fields such as `q` or `status`
 * passed in the `query` parameter. The products can also be sorted or paginated.
 *
 * @example
 * To list products in a price list:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminPriceListProducts } from "medusa-react"
 *
 * type Props = {
 *   priceListId: string
 * }
 *
 * const PriceListProducts = ({
 *   priceListId
 * }: Props) => {
 *   const { products, isLoading } = useAdminPriceListProducts(
 *     priceListId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {products && !products.length && (
 *         <span>No Price Lists</span>
 *       )}
 *       {products && products.length > 0 && (
 *         <ul>
 *           {products.map((product) => (
 *             <li key={product.id}>{product.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default PriceListProducts
 * ```
 *
 * To specify relations that should be retrieved within the products:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminPriceListProducts } from "medusa-react"
 *
 * type Props = {
 *   priceListId: string
 * }
 *
 * const PriceListProducts = ({
 *   priceListId
 * }: Props) => {
 *   const { products, isLoading } = useAdminPriceListProducts(
 *     priceListId,
 *     {
 *       expand: "variants"
 *     }
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {products && !products.length && (
 *         <span>No Price Lists</span>
 *       )}
 *       {products && products.length > 0 && (
 *         <ul>
 *           {products.map((product) => (
 *             <li key={product.id}>{product.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default PriceListProducts
 * ```
 *
 * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminPriceListProducts } from "medusa-react"
 *
 * type Props = {
 *   priceListId: string
 * }
 *
 * const PriceListProducts = ({
 *   priceListId
 * }: Props) => {
 *   const {
 *     products,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminPriceListProducts(
 *     priceListId,
 *     {
 *       expand: "variants",
 *       limit: 20,
 *       offset: 0
 *     }
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {products && !products.length && (
 *         <span>No Price Lists</span>
 *       )}
 *       {products && products.length > 0 && (
 *         <ul>
 *           {products.map((product) => (
 *             <li key={product.id}>{product.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default PriceListProducts
 * ```
 *
 * @customNamespace Hooks.Admin.Price Lists
 * @category Queries
 */
export const useAdminPriceListProducts = (
  /**
   * The ID of the associated price list.
   */
  id: string,
  /**
   * Filters and pagination configurations applied on the retrieved products.
   */
  query?: AdminGetPriceListsPriceListProductsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductsListRes>,
    Error,
    ReturnType<PriceListQueryKeys["detailProducts"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminPriceListKeys.detailProducts(id, query),
    queryFn: () => client.admin.priceLists.listProducts(id, query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a price list's details.
 *
 * @example
 * import React from "react"
 * import { useAdminPriceList } from "medusa-react"
 *
 * type Props = {
 *   priceListId: string
 * }
 *
 * const PriceList = ({
 *   priceListId
 * }: Props) => {
 *   const {
 *     price_list,
 *     isLoading,
 *   } = useAdminPriceList(priceListId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {price_list && <span>{price_list.name}</span>}
 *     </div>
 *   )
 * }
 *
 * export default PriceList
 *
 * @customNamespace Hooks.Admin.Price Lists
 * @category Queries
 */
export const useAdminPriceList = (
  /**
   * The price list's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminPriceListRes>,
    Error,
    ReturnType<PriceListQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminPriceListKeys.detail(id),
    queryFn: () => client.admin.priceLists.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
