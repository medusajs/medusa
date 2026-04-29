import type { PaymentDTO } from "@medusajs/framework/types"
import { deepFlatMap, MathBN } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../../common"
import { refundPaymentsWorkflow } from "../../../payment/workflows/refund-payments"

export const refundCapturedPaymentsWorkflowId =
  "refund-captured-payments-workflow"
/**
 * This workflow refunds a payment.
 */
export const refundCapturedPaymentsWorkflow = createWorkflow(
  refundCapturedPaymentsWorkflowId,
  (
    input: WorkflowData<{
      order_id: string
      created_by?: string
      note?: string
    }>
  ) => {
    const orderQuery = useQueryGraphStep({
      entity: "orders",
      fields: [
        "id",
        "status",
        "summary",
        "total",
        "payment_collections.payments.id",
        "payment_collections.payments.amount",
        "payment_collections.payments.refunds.id",
        "payment_collections.payments.refunds.amount",
        "payment_collections.payments.captures.id",
        "payment_collections.payments.captures.amount",
      ],
      filters: { id: input.order_id },
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-order" })

    const order = transform(
      { orderQuery },
      ({ orderQuery }) => orderQuery.data[0]
    )

    const refundPaymentsData = transform(
      { order, input },
      ({ order, input }) => {
        const payments: PaymentDTO[] = deepFlatMap(
          order,
          "payment_collections.payments",
          ({ payments }) => payments
        )

        const capturedPayments = payments.filter(
          (payment) => payment.captures?.length
        )

        return capturedPayments
          .map((payment) => {
            const capturedAmount = (payment.captures || []).reduce(
              (acc, capture) => MathBN.sum(acc, capture.amount),
              MathBN.convert(0)
            )
            const refundedAmount = (payment.refunds || []).reduce(
              (acc, refund) => MathBN.sum(acc, refund.amount),
              MathBN.convert(0)
            )

            const amountToRefund = MathBN.sub(capturedAmount, refundedAmount)

            return {
              payment_id: payment.id,
              created_by: input.created_by,
              amount: amountToRefund,
              note: input.note,
            }
          })
          .filter((payment) => MathBN.gt(payment.amount, 0))
      }
    )

    const totalCaptured = transform(
      { refundPaymentsData },
      ({ refundPaymentsData }) =>
        refundPaymentsData.reduce(
          (acc, refundPayment) => MathBN.sum(acc, refundPayment.amount),
          MathBN.convert(0)
        )
    )

    const refundedPayments = when({ totalCaptured }, ({ totalCaptured }) => {
      return !!MathBN.gt(totalCaptured, 0)
    }).then(() => {
      return refundPaymentsWorkflow.runAsStep({ input: refundPaymentsData })
    })

    const response = transform(
      { refundedPayments },
      ({ refundedPayments }) => refundedPayments ?? []
    )
    return new WorkflowResponse(response as PaymentDTO[])
  }
)
