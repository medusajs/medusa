import {
  AdminGetOrdersParams,
  AdminOrdersListRes,
  AdminOrdersRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { FindParams } from "@medusajs/medusa/dist/types/common"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_ORDERS_QUERY_KEY = `admin_orders` as const

export const adminOrderKeys = {
  ...queryKeysFactory(ADMIN_ORDERS_QUERY_KEY),
  detailOrder(id: string, query?: FindParams) {
    return [...this.detail(id), { ...(query || {}) }]
  },
}

type OrderQueryKeys = typeof adminOrderKeys

/**
 * This hook retrieves a list of orders. The orders can be filtered by fields such as `status` or `display_id` passed
 * in the `query` parameter. The order can also be paginated.
 *
 * @example
 * To list orders:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminOrders } from "medusa-react"
 *
 * const Orders = () => {
 *   const { orders, isLoading } = useAdminOrders()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {orders && !orders.length && <span>No Orders</span>}
 *       {orders && orders.length > 0 && (
 *         <ul>
 *           {orders.map((order) => (
 *             <li key={order.id}>{order.display_id}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Orders
 * ```
 *
 * You can use the `query` parameter to pass filters and specify relations that should be retrieved within the orders. In addition,
 * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminOrders } from "medusa-react"
 *
 * const Orders = () => {
 *   const {
 *     orders,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminOrders({
 *     expand: "customers",
 *     limit: 20,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {orders && !orders.length && <span>No Orders</span>}
 *       {orders && orders.length > 0 && (
 *         <ul>
 *           {orders.map((order) => (
 *             <li key={order.id}>{order.display_id}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Orders
 * ```
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Queries
 */
export const useAdminOrders = (
  /**
   * Filters and pagination configurations applied on the retrieved orders.
   */
  query?: AdminGetOrdersParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminOrdersListRes>,
    Error,
    ReturnType<OrderQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminOrderKeys.list(query),
    queryFn: () => client.admin.orders.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieve an order's details.
 *
 * @example
 * A simple example that retrieves an order by its ID:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminOrder } from "medusa-react"
 *
 * type Props = {
 *   orderId: string
 * }
 *
 * const Order = ({ orderId }: Props) => {
 *   const {
 *     order,
 *     isLoading,
 *   } = useAdminOrder(orderId)
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
 * ```
 *
 * To specify relations that should be retrieved:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminOrder } from "medusa-react"
 *
 * const Order = (
 *   orderId: string
 * ) => {
 *   const {
 *     order,
 *     isLoading,
 *   } = useAdminOrder(orderId, {
 *     expand: "customer"
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
 * ```
 *
 * @customNamespace Hooks.Admin.Orders
 * @category Queries
 */
export const useAdminOrder = (
  /**
   * The order's ID.
   */
  id: string,
  /**
   * Configurations to apply on the retrieved order.
   */
  query?: FindParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminOrdersRes>,
    Error,
    ReturnType<OrderQueryKeys["detailOrder"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminOrderKeys.detailOrder(id, query),
    queryFn: () => client.admin.orders.retrieve(id, query),
    ...options,
  })
  return { ...data, ...rest } as const
}
