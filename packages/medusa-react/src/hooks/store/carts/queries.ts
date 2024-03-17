import { StoreCartsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const CARTS_QUERY_KEY = `carts` as const

export const cartKeys = queryKeysFactory(CARTS_QUERY_KEY)
type CartQueryKey = typeof cartKeys

/**
 * This hook retrieves a Cart's details. This includes recalculating its totals.
 *
 * @example
 * import React from "react"
 * import { useGetCart } from "medusa-react"
 *
 * type Props = {
 *   cartId: string
 * }
 *
 * const Cart = ({ cartId }: Props) => {
 *   const { cart, isLoading } = useGetCart(cartId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {cart && cart.items.length === 0 && (
 *         <span>Cart is empty</span>
 *       )}
 *       {cart && cart.items.length > 0 && (
 *         <ul>
 *           {cart.items.map((item) => (
 *             <li key={item.id}>{item.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Cart
 *
 * @customNamespace Hooks.Store.Carts
 * @category Queries
 */
export const useGetCart = (
  /**
   * The cart's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreCartsRes>,
    Error,
    ReturnType<CartQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: cartKeys.detail(id),
    queryFn: () => client.carts.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
