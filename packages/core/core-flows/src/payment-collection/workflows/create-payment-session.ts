import { PaymentProviderContext, PaymentSessionDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { createPaymentSessionStep } from "../steps"
import { deletePaymentSessionsWorkflow } from "./delete-payment-sessions"

interface WorkflowInput {
  payment_collection_id: string
  provider_id: string
  data?: Record<string, unknown>
  context?: PaymentProviderContext
}

export const createPaymentSessionsWorkflowId = "create-payment-sessions"
export const createPaymentSessionsWorkflow = createWorkflow(
  createPaymentSessionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowResponse<PaymentSessionDTO> => {
    const paymentCollection = useRemoteQueryStep({
      entry_point: "payment_collection",
      fields: ["id", "amount", "currency_code", "payment_sessions.*"],
      variables: { id: input.payment_collection_id },
      list: false,
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

    const deletePaymentSessionInput = transform(
      { paymentCollection },
      (data) => {
        return {
          ids:
            data.paymentCollection?.payment_sessions?.map((ps) => ps.id) || [],
        }
      }
    )

    // Note: We are deleting an existing active session before creating a new one
    // for a payment collection as we don't support split payments at the moment.
    // When we are ready to accept split payments, this along with other workflows
    // need to be handled correctly
    const [created] = parallelize(
      createPaymentSessionStep(paymentSessionInput),
      deletePaymentSessionsWorkflow.runAsStep({
        input: deletePaymentSessionInput,
      })
    )

    return new WorkflowResponse(created)
  }
)
