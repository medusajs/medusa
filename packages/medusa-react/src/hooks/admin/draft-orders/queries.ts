import {
  AdminDraftOrdersListRes,
  AdminDraftOrdersRes,
  AdminGetDraftOrdersParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_DRAFT_ORDERS_QUERY_KEY = `admin_draft_orders` as const

export const adminDraftOrderKeys = queryKeysFactory(
  ADMIN_DRAFT_ORDERS_QUERY_KEY
)

type DraftOrderQueryKeys = typeof adminDraftOrderKeys

/**
 * This hook retrieves an list of Draft Orders. The draft orders can be filtered by parameters such as `query`. The draft orders can also paginated.
 *
 * @example
 * To list draft orders:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminDraftOrders } from "medusa-react"
 *
 * const DraftOrders = () => {
 *   const { draft_orders, isLoading } = useAdminDraftOrders()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {draft_orders && !draft_orders.length && (
 *         <span>No Draft Orders</span>
 *       )}
 *       {draft_orders && draft_orders.length > 0 && (
 *         <ul>
 *           {draft_orders.map((order) => (
 *             <li key={order.id}>{order.display_id}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default DraftOrders
 * ```
 *
 * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminDraftOrders } from "medusa-react"
 *
 * const DraftOrders = () => {
 *   const {
 *     draft_orders,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminDraftOrders({
 *     limit: 20,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {draft_orders && !draft_orders.length && (
 *         <span>No Draft Orders</span>
 *       )}
 *       {draft_orders && draft_orders.length > 0 && (
 *         <ul>
 *           {draft_orders.map((order) => (
 *             <li key={order.id}>{order.display_id}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default DraftOrders
 * ```
 *
 * @customNamespace Hooks.Admin.Draft Orders
 * @category Queries
 */
export const useAdminDraftOrders = (
  /**
   * Filters and pagination configurations to apply on the retrieved draft orders.
   */
  query?: AdminGetDraftOrdersParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminDraftOrdersListRes>,
    Error,
    ReturnType<DraftOrderQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminDraftOrderKeys.list(query),
    queryFn: () => client.admin.draftOrders.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a Draft Order's details.
 *
 * @example
 * import React from "react"
 * import { useAdminDraftOrder } from "medusa-react"
 *
 * type Props = {
 *   draftOrderId: string
 * }
 *
 * const DraftOrder = ({ draftOrderId }: Props) => {
 *   const {
 *     draft_order,
 *     isLoading,
 *   } = useAdminDraftOrder(draftOrderId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {draft_order && <span>{draft_order.display_id}</span>}
 *
 *     </div>
 *   )
 * }
 *
 * export default DraftOrder
 *
 * @customNamespace Hooks.Admin.Draft Orders
 * @category Queries
 */
export const useAdminDraftOrder = (
  /**
   * The draft order's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminDraftOrdersRes>,
    Error,
    ReturnType<DraftOrderQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminDraftOrderKeys.detail(id),
    queryFn: () => client.admin.draftOrders.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
