import { PaymentSessionDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { updatePaymentSessionStep } from "../steps/update-payment-session"

export interface UpdatePaymentSessionsWorkflowInput {
  id: string
  provider_id: string
  data?: Record<string, unknown>
}

export const updatePaymentSessionWorkflowId = "update-payment-session"
/**
 * This workflow creates payment sessions.
 */
export const updatePaymentSessionWorkflow = createWorkflow(
  updatePaymentSessionWorkflowId,
  (
    input: WorkflowData<UpdatePaymentSessionsWorkflowInput>
  ): WorkflowResponse<PaymentSessionDTO> => {
    const paymentSession = useRemoteQueryStep({
      entry_point: "payment_session",
      fields: ["id", "amount", "currency_code"],
      variables: { id: input.id },
      list: false,
    })

    const paymentSessionInput = transform({ paymentSession, input }, (data) => {
      return {
        id: data.paymentSession.id,
        data: data.input.data,
        provider_id: data.input.provider_id,
      }
    })

    const updated = updatePaymentSessionStep(paymentSessionInput)

    return new WorkflowResponse(updated)
  }
)
