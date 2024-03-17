import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import {
  AdminPaymentRes,
  AdminPostPaymentRefundsReq,
  AdminRefundRes,
} from "@medusajs/medusa"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminPaymentQueryKeys } from "./queries"

/**
 * This hook captures a payment.
 *
 * @example
 * import React from "react"
 * import { useAdminPaymentsCapturePayment } from "medusa-react"
 *
 * type Props = {
 *   paymentId: string
 * }
 *
 * const Payment = ({ paymentId }: Props) => {
 *   const capture = useAdminPaymentsCapturePayment(
 *     paymentId
 *   )
 *   // ...
 *
 *   const handleCapture = () => {
 *     capture.mutate(void 0, {
 *       onSuccess: ({ payment }) => {
 *         console.log(payment.amount)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Payment
 *
 * @customNamespace Hooks.Admin.Payments
 * @category Mutations
 */
export const useAdminPaymentsCapturePayment = (
  /**
   * The payment's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminPaymentRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.payments.capturePayment(id),
    ...buildOptions(
      queryClient,
      [adminPaymentQueryKeys.detail(id), adminPaymentQueryKeys.lists()],
      options
    ),
  })
}

/**
 * This hook refunds a payment. The payment must be captured first.
 *
 * @example
 * import React from "react"
 * import { RefundReason } from "@medusajs/medusa"
 * import { useAdminPaymentsRefundPayment } from "medusa-react"
 *
 * type Props = {
 *   paymentId: string
 * }
 *
 * const Payment = ({ paymentId }: Props) => {
 *   const refund = useAdminPaymentsRefundPayment(
 *     paymentId
 *   )
 *   // ...
 *
 *   const handleRefund = (
 *     amount: number,
 *     reason: RefundReason,
 *     note: string
 *   ) => {
 *     refund.mutate({
 *       amount,
 *       reason,
 *       note
 *     }, {
 *       onSuccess: ({ refund }) => {
 *         console.log(refund.amount)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Payment
 *
 * @customNamespace Hooks.Admin.Payments
 * @category Mutations
 */
export const useAdminPaymentsRefundPayment = (
  /**
   * The payment's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminRefundRes>,
    Error,
    AdminPostPaymentRefundsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostPaymentRefundsReq) =>
      client.admin.payments.refundPayment(id, payload),
    ...buildOptions(
      queryClient,
      [adminPaymentQueryKeys.detail(id), adminPaymentQueryKeys.lists()],
      options
    ),
  })
}
