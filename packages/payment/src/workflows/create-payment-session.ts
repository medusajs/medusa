import { PaymentProviderContext, PaymentSessionDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createPaymentProviderSessionStep,
  createPaymentSessionStep,
} from "./steps"

interface WorkflowInput {
  payment_collection_id: string
  provider_id: string
  amount: number
  currency_code: string
  context: PaymentProviderContext
  data: Record<string, unknown>
}

export const paymentSessionWorkflowId = "module:payment-session-workflow"
export const paymentSessionWorkflow = createWorkflow(
  paymentSessionWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<PaymentSessionDTO> => {
    const providerSession = createPaymentProviderSessionStep({
      provider_id: input.provider_id,
      data: {
        context: input.context,
        amount: input.amount,
        currency_code: input.currency_code,
      },
    })

    const sessionInput = transform({ input, providerSession }, (data) => {
      return {
        payment_collection_id: data.input.payment_collection_id,
        provider_id: data.input.provider_id,
        amount: data.input.amount,
        currency_code: data.input.currency_code,
        context: data.input.context,
        data: data.providerSession,
      }
    })

    const created = createPaymentSessionStep(sessionInput)

    return created
  }
)
