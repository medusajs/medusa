import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import {
  StoreOrderEditsRes,
  StorePostOrderEditsOrderEditDecline,
} from "@medusajs/medusa"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { orderEditQueryKeys } from "./queries"

/**
 * This hook declines an Order Edit. The changes are not reflected on the original order.
 *
 * @example
 * import React from "react"
 * import { useDeclineOrderEdit } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 * }
 *
 * const OrderEdit = ({ orderEditId }: Props) => {
 *   const declineOrderEdit = useDeclineOrderEdit(orderEditId)
 *   // ...
 *
 *   const handleDeclineOrderEdit = (
 *     declinedReason: string
 *   ) => {
 *     declineOrderEdit.mutate({
 *       declined_reason: declinedReason,
 *     }, {
 *       onSuccess: ({ order_edit }) => {
 *         console.log(order_edit.declined_at)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default OrderEdit
 *
 * @customNamespace Hooks.Store.Order Edits
 * @category Mutations
 */
export const useDeclineOrderEdit = (
  /**
   * The order edit's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<StoreOrderEditsRes>,
    Error,
    StorePostOrderEditsOrderEditDecline
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StorePostOrderEditsOrderEditDecline) =>
      client.orderEdits.decline(id, payload),
    ...buildOptions(
      queryClient,
      [orderEditQueryKeys.lists(), orderEditQueryKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook completes and confirms an Order Edit and reflect its changes on the original order. Any additional payment required must
 * be authorized first using the {@link Hooks.Store."Payment Collections".useAuthorizePaymentSession | useAuthorizePaymentSession} hook.
 *
 * @example
 * import React from "react"
 * import { useCompleteOrderEdit } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 * }
 *
 * const OrderEdit = ({ orderEditId }: Props) => {
 *   const completeOrderEdit = useCompleteOrderEdit(
 *     orderEditId
 *   )
 *   // ...
 *
 *   const handleCompleteOrderEdit = () => {
 *     completeOrderEdit.mutate(void 0, {
 *       onSuccess: ({ order_edit }) => {
 *         console.log(order_edit.confirmed_at)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default OrderEdit
 *
 * @customNamespace Hooks.Store.Order Edits
 * @category Mutations
 */
export const useCompleteOrderEdit = (
  /**
   * The order edit's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<StoreOrderEditsRes>, Error>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.orderEdits.complete(id),
    ...buildOptions(
      queryClient,
      [orderEditQueryKeys.lists(), orderEditQueryKeys.detail(id)],
      options
    ),
  })
}
