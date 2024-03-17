import {
  AdminOrderEditsListRes,
  AdminOrderEditsRes,
  GetOrderEditsOrderEditParams,
  GetOrderEditsParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_ORDER_EDITS_QUERY_KEY = `admin_order_edits` as const

export const adminOrderEditsKeys = queryKeysFactory(ADMIN_ORDER_EDITS_QUERY_KEY)
type OrderEditQueryKeys = typeof adminOrderEditsKeys

/**
 * This hook retrieves an order edit's details.
 *
 * @example
 * A simple example that retrieves an order edit by its ID:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminOrderEdit } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 * }
 *
 * const OrderEdit = ({ orderEditId }: Props) => {
 *   const {
 *     order_edit,
 *     isLoading,
 *   } = useAdminOrderEdit(orderEditId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {order_edit && <span>{order_edit.status}</span>}
 *     </div>
 *   )
 * }
 *
 * export default OrderEdit
 * ```
 *
 * To specify relations that should be retrieved:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminOrderEdit } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 * }
 *
 * const OrderEdit = ({ orderEditId }: Props) => {
 *   const {
 *     order_edit,
 *     isLoading,
 *   } = useAdminOrderEdit(
 *     orderEditId,
 *     {
 *       expand: "order"
 *     }
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {order_edit && <span>{order_edit.status}</span>}
 *     </div>
 *   )
 * }
 *
 * export default OrderEdit
 * ```
 *
 * @customNamespace Hooks.Admin.Order Edits
 * @category Queries
 */
export const useAdminOrderEdit = (
  /**
   * The order edit's ID.
   */
  id: string,
  /**
   * Configurations to apply on the retrieved order edit.
   */
  query?: GetOrderEditsOrderEditParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminOrderEditsRes>,
    Error,
    ReturnType<OrderEditQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminOrderEditsKeys.detail(id),
    queryFn: () => client.admin.orderEdits.retrieve(id, query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a list of order edits. The order edits can be filtered by fields such as `q` or `order_id` passed to the `query` parameter.
 * The order edits can also be paginated.
 *
 * @example
 * To list order edits:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminOrderEdits } from "medusa-react"
 *
 * const OrderEdits = () => {
 *   const { order_edits, isLoading } = useAdminOrderEdits()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {order_edits && !order_edits.length && (
 *         <span>No Order Edits</span>
 *       )}
 *       {order_edits && order_edits.length > 0 && (
 *         <ul>
 *           {order_edits.map((orderEdit) => (
 *             <li key={orderEdit.id}>
 *               {orderEdit.status}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default OrderEdits
 * ```
 *
 * To specify relations that should be retrieved within the order edits:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminOrderEdits } from "medusa-react"
 *
 * const OrderEdits = () => {
 *   const { order_edits, isLoading } = useAdminOrderEdits({
 *     expand: "order"
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {order_edits && !order_edits.length && (
 *         <span>No Order Edits</span>
 *       )}
 *       {order_edits && order_edits.length > 0 && (
 *         <ul>
 *           {order_edits.map((orderEdit) => (
 *             <li key={orderEdit.id}>
 *               {orderEdit.status}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default OrderEdits
 * ```
 *
 * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminOrderEdits } from "medusa-react"
 *
 * const OrderEdits = () => {
 *   const {
 *     order_edits,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminOrderEdits({
 *     expand: "order",
 *     limit: 20,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {order_edits && !order_edits.length && (
 *         <span>No Order Edits</span>
 *       )}
 *       {order_edits && order_edits.length > 0 && (
 *         <ul>
 *           {order_edits.map((orderEdit) => (
 *             <li key={orderEdit.id}>
 *               {orderEdit.status}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default OrderEdits
 * ```
 *
 * @customNamespace Hooks.Admin.Order Edits
 * @category Queries
 */
export const useAdminOrderEdits = (
  /**
   * Filters and pagination configurations applied to retrieved order edits.
   */
  query?: GetOrderEditsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminOrderEditsListRes>,
    Error,
    ReturnType<OrderEditQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminOrderEditsKeys.list(query),
    queryFn: () => client.admin.orderEdits.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}
