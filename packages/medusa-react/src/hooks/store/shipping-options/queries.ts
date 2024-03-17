import {
  StoreGetShippingOptionsParams,
  StoreShippingOptionsListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const SHIPPING_OPTION_QUERY_KEY = `shipping_options` as const

const shippingOptionKey = {
  ...queryKeysFactory(SHIPPING_OPTION_QUERY_KEY),
  cart: (cartId: string) => [...shippingOptionKey.all, "cart", cartId] as const,
}

type ShippingOptionQueryKey = typeof shippingOptionKey

/**
 * This hook retrieves a list of shipping options. The shipping options can be filtered using the `query` parameter.
 *
 * @example
 * import React from "react"
 * import { useShippingOptions } from "medusa-react"
 *
 * const ShippingOptions = () => {
 *   const {
 *     shipping_options,
 *     isLoading,
 *   } = useShippingOptions()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {shipping_options?.length &&
 *         shipping_options?.length > 0 && (
 *         <ul>
 *           {shipping_options?.map((shipping_option) => (
 *             <li key={shipping_option.id}>
 *               {shipping_option.id}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default ShippingOptions
 *
 * @customNamespace Hooks.Store.Shipping Options
 * @category Queries
 */
export const useShippingOptions = (
  /**
   * The filters to apply on the shipping options.
   */
  query?: StoreGetShippingOptionsParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreShippingOptionsListRes>,
    Error,
    ReturnType<ShippingOptionQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: shippingOptionKey.list(query),
    queryFn: () => client.shippingOptions.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a list of shipping options available for a cart.
 *
 * @example
 * import React from "react"
 * import { useCartShippingOptions } from "medusa-react"
 *
 * type Props = {
 *   cartId: string
 * }
 *
 * const ShippingOptions = ({ cartId }: Props) => {
 *   const { shipping_options, isLoading } =
 *     useCartShippingOptions(cartId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {shipping_options && !shipping_options.length && (
 *         <span>No shipping options</span>
 *       )}
 *       {shipping_options && (
 *         <ul>
 *           {shipping_options.map(
 *             (shipping_option) => (
 *               <li key={shipping_option.id}>
 *                 {shipping_option.name}
 *               </li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default ShippingOptions
 *
 * @customNamespace Hooks.Store.Shipping Options
 * @category Queries
 */
export const useCartShippingOptions = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreShippingOptionsListRes>,
    Error,
    ReturnType<ShippingOptionQueryKey["cart"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: shippingOptionKey.cart(cartId),
    queryFn: () => client.shippingOptions.listCartOptions(cartId),
    ...options,
  })
  return { ...data, ...rest } as const
}
