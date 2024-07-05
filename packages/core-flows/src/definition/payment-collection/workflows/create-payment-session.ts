import { PaymentProviderContext, PaymentSessionDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createPaymentSessionStep,
  retrievePaymentCollectionStep,
} from "../steps"

interface WorkflowInput {
  payment_collection_id: string
  provider_id: string
  data?: Record<string, unknown>
  context?: PaymentProviderContext
}

export const createPaymentSessionsWorkflowId = "create-payment-sessions"
export const createPaymentSessionsWorkflow = createWorkflow(
  createPaymentSessionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<PaymentSessionDTO> => {
    const paymentCollection = retrievePaymentCollectionStep({
      id: input.payment_collection_id,
      config: {
        select: ["id", "amount", "currency_code"],
      },
    })

    const paymentSessionInput = transform(
      { paymentCollection, input },
      (data) => {
        return {
          payment_collection_id: data.input.payment_collection_id,
          provider_id: data.input.provider_id,
          data: data.input.data,
          context: data.input.context,
          amount: data.paymentCollection.amount,
          currency_code: data.paymentCollection.currency_code,
        }
      }
    )

    const created = createPaymentSessionStep(paymentSessionInput)
    return created
  }
)
