import { BigNumberInput } from "@medusajs/types"
import { MathBN, PaymentEvents } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../common"
import { addOrderTransactionStep } from "../../order/steps/add-order-transaction"
import { refundPaymentStep } from "../steps/refund-payment"

export const refundPaymentWorkflowId = "refund-payment-workflow"
/**
 * This workflow refunds a payment.
 */
export const refundPaymentWorkflow = createWorkflow(
  refundPaymentWorkflowId,
  (
    input: WorkflowData<{
      payment_id: string
      created_by?: string
      amount?: BigNumberInput
    }>
  ) => {
    const payment = refundPaymentStep(input)

    const orderPayment = useRemoteQueryStep({
      entry_point: "order_payment_collection",
      fields: ["order.id"],
      variables: { payment_collection_id: payment.payment_collection_id },
      list: false,
    })

    when({ orderPayment }, ({ orderPayment }) => {
      return !!orderPayment?.order?.id
    }).then(() => {
      const orderTransactionData = transform(
        { input, payment, orderPayment },
        ({ input, payment }) => {
          return {
            order_id: orderPayment.id,
            amount: MathBN.mult(
              input.amount ?? payment.raw_amount ?? payment.amount,
              -1
            ),
            currency_code: payment.currency_code,
            reference_id: payment.id,
            reference: "refund",
          }
        }
      )

      addOrderTransactionStep(orderTransactionData)
    })

    emitEventStep({
      eventName: PaymentEvents.REFUNDED,
      data: { id: payment.id },
    })

    return new WorkflowResponse(payment)
  }
)
