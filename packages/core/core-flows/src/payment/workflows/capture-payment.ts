import { BigNumberInput, PaymentDTO } from "@medusajs/types"
import { PaymentEvents } from "@medusajs/utils"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { emitEventStep } from "../../common"
import { capturePaymentStep } from "../steps/capture-payment"

export const capturePaymentWorkflowId = "capture-payment-workflow"
export const capturePaymentWorkflow = createWorkflow(
  capturePaymentWorkflowId,
  (
    input: WorkflowData<{
      payment_id: string
      captured_by?: string
      amount?: BigNumberInput
    }>
  ): WorkflowData<PaymentDTO> => {
    const payment = capturePaymentStep(input)

    emitEventStep({
      eventName: PaymentEvents.CAPTURED,
      data: { id: payment.id },
    })

    return payment
  }
)
