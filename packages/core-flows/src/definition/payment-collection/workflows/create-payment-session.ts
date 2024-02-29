import { PaymentProviderContext, PaymentSessionDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createPaymentSessionStep } from "../steps"

interface WorkflowInput {
  payment_collection_id: string
  provider_id: string
  amount: number
  currency_code: string
  context: PaymentProviderContext
  data: Record<string, unknown>
}

export const createPaymentSessionsWorkflowId = "create-payment-sessions"
export const createPaymentSessionsWorkflow = createWorkflow(
  createPaymentSessionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<PaymentSessionDTO> => {
    const created = createPaymentSessionStep(input)
    return created
  }
)
