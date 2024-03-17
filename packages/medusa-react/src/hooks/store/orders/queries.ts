import { StoreGetOrdersParams, StoreOrdersRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ORDERS_QUERY_KEY = `orders` as const

export const orderKeys = {
  ...queryKeysFactory<typeof ORDERS_QUERY_KEY, StoreGetOrdersParams>(
    ORDERS_QUERY_KEY
  ),
  cart: (cartId: string) => [...orderKeys.details(), "cart", cartId] as const,
}

type OrderQueryKey = typeof orderKeys

/**
 * This hook retrieves an Order's details.
 *
 * @example
 * import React from "react"
 * import { useOrder } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const {
 *     order,
 *     isLoading,
 *   } = useOrder(orderId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {order && <span>{order.display_id}</span>}
 *
 *     </div>
 *   )
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Store.Orders
 * @category Queries
 */
export const useOrder = (
  /**
   * The order's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreOrdersRes>,
    Error,
    ReturnType<OrderQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => client.orders.retrieve(id),
    ...options,
  })

  return { ...data, ...rest } as const
}

/**
 * This hook retrieves an order's details by the ID of the cart that was used to create the order.
 *
 * @example
 * import React from "react"
 * import { useCartOrder } from "medusa-react"
 *
 * type Props = {
 *   cartId: string
 * }
 *
 * const Order = ({ cartId }: Props) => {
 *   const {
 *     order,
 *     isLoading,
 *   } = useCartOrder(cartId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {order && <span>{order.display_id}</span>}
 *
 *     </div>
 *   )
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Store.Orders
 * @category Queries
 */
export const useCartOrder = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreOrdersRes>,
    Error,
    ReturnType<OrderQueryKey["cart"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: orderKeys.cart(cartId),
    queryFn: () => client.orders.retrieveByCartId(cartId),
    ...options,
  })

  return { ...data, ...rest } as const
}

/**
 * This hook looks up an order using filters. If the filters don't narrow down the results to a single order, a `404` response is returned with no orders.
 *
 * @example
 * import React from "react"
 * import { useOrders } from "medusa-react"
 *
 * type Props = {
 *   displayId: number
 *   email: string
 * }
 *
 * const Order = ({
 *   displayId,
 *   email
 * }: Props) => {
 *   const {
 *     order,
 *     isLoading,
 *   } = useOrders({
 *     display_id: displayId,
 *     email,
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {order && <span>{order.display_id}</span>}
 *
 *     </div>
 *   )
 * }
 *
 * export default Order
 *
 * @customNamespace Hooks.Store.Orders
 * @category Queries
 */
export const useOrders = (
  /**
   * Filters used to retrieve the order.
   */
  query: StoreGetOrdersParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreOrdersRes>,
    Error,
    ReturnType<OrderQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: orderKeys.list(query),
    queryFn: () => client.orders.lookupOrder(query),
    ...options,
  })

  return { ...data, ...rest } as const
}
