import {
  PaymentProviderContext,
  PaymentSessionDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { createPaymentSessionStep } from "../steps"
import { deletePaymentSessionsWorkflow } from "./delete-payment-sessions"

export interface CreatePaymentSessionsWorkflowInput {
  payment_collection_id: string
  provider_id: string
  data?: Record<string, unknown>
  context?: PaymentProviderContext
}

export const createPaymentSessionsWorkflowId = "create-payment-sessions"
/**
 * This workflow creates payment sessions.
 */
export const createPaymentSessionsWorkflow = createWorkflow(
  createPaymentSessionsWorkflowId,
  (
    input: WorkflowData<CreatePaymentSessionsWorkflowInput>
  ): WorkflowResponse<PaymentSessionDTO> => {
    const paymentCollection = useRemoteQueryStep({
      entry_point: "payment_collection",
      fields: ["id", "amount", "currency_code", "payment_sessions.*"],
      variables: { id: input.payment_collection_id },
      list: false,
    })

    const cartLink = useRemoteQueryStep({
      entry_point: "cart_payment_collection",
      fields: ["cart_id"],
      variables: { payment_collection_id: input.payment_collection_id },
      list: false,
    }).config({ name: "get-cart-payment-collection-link" })

    const cart = useRemoteQueryStep({
      entry_point: "cart",
      // Comment: We will likely need more fields here to support other payment flows, e.g. checkouts
      fields: [
        "id",
        "email",
        "shipping_address.*",
        "billing_address.*",
        "customer.*",
      ],
      variables: { id: cartLink.cart_id },
      list: false,
    }).config({ name: "get-cart" })

    const paymentSessionInput = transform(
      { paymentCollection, input, cart },
      (data) => {
        return {
          payment_collection_id: data.input.payment_collection_id,
          provider_id: data.input.provider_id,
          data: data.input.data,
          context: { ...data.input.context, cart: { ...(data?.cart ?? {}) } },
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
