import { BigNumberInput, PaymentDTO } from "@medusajs/framework/types"
import { PaymentEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../common"
import { addOrderTransactionStep } from "../../order/steps/add-order-transaction"
import { capturePaymentStep } from "../steps/capture-payment"

export const capturePaymentWorkflowId = "capture-payment-workflow"
/**
 * This workflow captures a payment.
 */
export const capturePaymentWorkflow = createWorkflow(
  capturePaymentWorkflowId,
  (
    input: WorkflowData<{
      payment_id: string
      captured_by?: string
      amount?: BigNumberInput
    }>
  ): WorkflowResponse<PaymentDTO> => {
    const payment = capturePaymentStep(input)

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
        ({ input, payment, orderPayment }) => {
          return {
            order_id: orderPayment.order.id,
            amount: input.amount ?? payment.raw_amount ?? payment.amount,
            currency_code: payment.currency_code,
            reference_id: payment.id,
            reference: "capture",
          }
        }
      )

      addOrderTransactionStep(orderTransactionData)
    })

    emitEventStep({
      eventName: PaymentEvents.CAPTURED,
      data: { id: payment.id },
    })

    return new WorkflowResponse(payment)
  }
)
