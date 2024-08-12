import { BigNumberInput } from "@medusajs/types"
import { MathBN, PaymentEvents } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { emitEventStep } from "../../common"
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

    addOrderTransactionStep({
      order_id: payment.order_id!,
      amount: MathBN.mult(
        input.amount ?? payment.raw_amount ?? payment.amount,
        -1
      ),
      currency_code: payment.currency_code,
      reference_id: payment.id,
      reference: "refund",
    })

    emitEventStep({
      eventName: PaymentEvents.REFUNDED,
      data: { id: payment.id },
    })

    return new WorkflowResponse(payment)
  }
)
