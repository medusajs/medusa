import {
  AdminPostReturnReasonsReasonReq,
  AdminPostReturnReasonsReq,
  AdminReturnReasonsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminReturnReasonKeys } from "./queries"

/**
 * This hook creates a return reason.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateReturnReason } from "medusa-react"
 *
 * const CreateReturnReason = () => {
 *   const createReturnReason = useAdminCreateReturnReason()
 *   // ...
 *
 *   const handleCreate = (
 *     label: string,
 *     value: string
 *   ) => {
 *     createReturnReason.mutate({
 *       label,
 *       value,
 *     }, {
 *       onSuccess: ({ return_reason }) => {
 *         console.log(return_reason.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateReturnReason
 *
 * @customNamespace Hooks.Admin.Return Reasons
 * @category Mutations
 */
export const useAdminCreateReturnReason = (
  options?: UseMutationOptions<
    Response<AdminReturnReasonsRes>,
    Error,
    AdminPostReturnReasonsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostReturnReasonsReq) =>
      client.admin.returnReasons.create(payload),
    ...buildOptions(queryClient, adminReturnReasonKeys.lists(), options),
  })
}

/**
 * This hook updates a return reason's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateReturnReason } from "medusa-react"
 *
 * type Props = {
 *   returnReasonId: string
 * }
 *
 * const ReturnReason = ({ returnReasonId }: Props) => {
 *   const updateReturnReason = useAdminUpdateReturnReason(
 *     returnReasonId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     label: string
 *   ) => {
 *     updateReturnReason.mutate({
 *       label,
 *     }, {
 *       onSuccess: ({ return_reason }) => {
 *         console.log(return_reason.label)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ReturnReason
 *
 * @customNamespace Hooks.Admin.Return Reasons
 * @category Mutations
 */
export const useAdminUpdateReturnReason = (
  /**
   * The return reason's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminReturnReasonsRes>,
    Error,
    AdminPostReturnReasonsReasonReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostReturnReasonsReasonReq) =>
      client.admin.returnReasons.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminReturnReasonKeys.detail(id), adminReturnReasonKeys.lists()],
      options
    ),
  })
}

/**
 * This hook deletes a return reason.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteReturnReason } from "medusa-react"
 *
 * type Props = {
 *   returnReasonId: string
 * }
 *
 * const ReturnReason = ({ returnReasonId }: Props) => {
 *   const deleteReturnReason = useAdminDeleteReturnReason(
 *     returnReasonId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteReturnReason.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ReturnReason
 *
 * @customNamespace Hooks.Admin.Return Reasons
 * @category Mutations
 */
export const useAdminDeleteReturnReason = (
  /**
   * The return reason's ID.
   */
  id: string,
  options?: UseMutationOptions
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.returnReasons.delete(id),
    ...buildOptions(
      queryClient,
      [adminReturnReasonKeys.detail(id), adminReturnReasonKeys.lists()],
      options
    ),
  })
}
