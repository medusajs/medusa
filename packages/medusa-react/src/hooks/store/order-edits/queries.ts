import { StoreOrderEditsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ORDER_EDITS_QUERY_KEY = `orderEdit` as const

export const orderEditQueryKeys = queryKeysFactory<
  typeof ORDER_EDITS_QUERY_KEY
>(ORDER_EDITS_QUERY_KEY)

type OrderQueryKey = typeof orderEditQueryKeys

/**
 * This hook retrieves an Order Edit's details.
 *
 * @example
 * import React from "react"
 * import { useOrderEdit } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 * }
 *
 * const OrderEdit = ({ orderEditId }: Props) => {
 *   const { order_edit, isLoading } = useOrderEdit(orderEditId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {order_edit && (
 *         <ul>
 *           {order_edit.changes.map((change) => (
 *             <li key={change.id}>{change.type}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default OrderEdit
 *
 * @customNamespace Hooks.Store.Order Edits
 * @category Queries
 */
export const useOrderEdit = (
  /**
   * The order edit's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreOrderEditsRes>,
    Error,
    ReturnType<OrderQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: orderEditQueryKeys.detail(id),
    queryFn: () => client.orderEdits.retrieve(id),
    ...options,
  })

  return { ...data, ...rest } as const
}
