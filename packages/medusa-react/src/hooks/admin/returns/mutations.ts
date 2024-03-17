import {
  AdminPostReturnsReturnReceiveReq,
  AdminReturnsCancelRes,
  AdminReturnsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminReturnKeys } from "./queries"

/**
 * This hook marks a return as received. This also updates the status of associated order, claim, or swap accordingly.
 *
 * @example
 * import React from "react"
 * import { useAdminReceiveReturn } from "medusa-react"
 *
 * type ReceiveReturnData = {
 *   items: {
 *     item_id: string
 *     quantity: number
 *   }[]
 * }
 *
 * type Props = {
 *   returnId: string
 * }
 *
 * const Return = ({ returnId }: Props) => {
 *   const receiveReturn = useAdminReceiveReturn(
 *     returnId
 *   )
 *   // ...
 *
 *   const handleReceive = (data: ReceiveReturnData) => {
 *     receiveReturn.mutate(data, {
 *       onSuccess: ({ return: dataReturn }) => {
 *         console.log(dataReturn.status)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Return
 *
 * @customNamespace Hooks.Admin.Returns
 * @category Mutations
 */
export const useAdminReceiveReturn = (
  /**
   * The return's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminReturnsRes>,
    Error,
    AdminPostReturnsReturnReceiveReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => client.admin.returns.receive(id, payload),
    ...buildOptions(
      queryClient,
      [adminReturnKeys.detail(id), adminReturnKeys.list()],
      options
    ),
  })
}

/**
 * This hook registers a return as canceled. The return can be associated with an order, claim, or swap.
 *
 * @example
 * import React from "react"
 * import { useAdminCancelReturn } from "medusa-react"
 *
 * type Props = {
 *   returnId: string
 * }
 *
 * const Return = ({ returnId }: Props) => {
 *   const cancelReturn = useAdminCancelReturn(
 *     returnId
 *   )
 *   // ...
 *
 *   const handleCancel = () => {
 *     cancelReturn.mutate(void 0, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.returns)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Return
 *
 * @customNamespace Hooks.Admin.Returns
 * @category Mutations
 */
export const useAdminCancelReturn = (
  /**
   * The return's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminReturnsCancelRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.returns.cancel(id),
    ...buildOptions(
      queryClient,
      [adminReturnKeys.detail(id), adminReturnKeys.list()],
      options
    ),
  })
}
