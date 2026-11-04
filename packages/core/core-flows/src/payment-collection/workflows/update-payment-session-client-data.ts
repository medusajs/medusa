import { PaymentSessionDTO } from "@medusajs/framework/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import {
  updatePaymentSessionStep,
  validatePaymentSessionUpdateStep,
} from "../steps"

/**
 * The data to update a payment session's client data.
 */
export interface UpdatePaymentSessionClientDataWorkflowInput {
  payment_collection_id: string
  payment_session_id: string
  client_data: Record<string, unknown>
}

export const updatePaymentSessionClientDataWorkflowId =
  "update-payment-session-client-data"
/**
 * This workflow merges client-provided data, such as payment details collected in the
 * storefront, into a payment session's `data.client`. The rest of `data` is owned by the
 * payment provider and isn't changed. It's used by the
 * [Update Payment Session Store API Route](https://docs.medusajs.com/api/store/payment-collections/update-payment-session).
 *
 * @example
 * const { result } = await updatePaymentSessionClientDataWorkflow(container)
 * .run({
 *   input: {
 *     payment_collection_id: "paycol_123",
 *     payment_session_id: "payses_123",
 *     client_data: {
 *       payment_method: "pm_123"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update a payment session's client data.
 */
export const updatePaymentSessionClientDataWorkflow = createWorkflow(
  updatePaymentSessionClientDataWorkflowId,
  (
    input: WorkflowData<UpdatePaymentSessionClientDataWorkflowInput>
  ): WorkflowResponse<PaymentSessionDTO> => {
    const { data: paymentSessions } = useQueryGraphStep({
      entity: "payment_session",
      fields: [
        "id",
        "payment_collection_id",
        "status",
        "amount",
        "currency_code",
        "data",
      ],
      filters: { id: input.payment_session_id },
    }).config({ name: "get-payment-session" })

    const paymentSession = transform(
      { paymentSessions },
      ({ paymentSessions }) => paymentSessions[0]
    )

    validatePaymentSessionUpdateStep({
      payment_collection_id: input.payment_collection_id,
      payment_session_id: input.payment_session_id,
      payment_session: paymentSession,
    })

    const updateInput = transform(
      { paymentSession, input },
      ({ paymentSession, input }) => ({
        id: paymentSession.id,
        amount: paymentSession.amount,
        currency_code: paymentSession.currency_code,
        data: {
          ...(paymentSession.data ?? {}),
          client: input.client_data,
        },
      })
    )

    const updated = updatePaymentSessionStep(updateInput)

    return new WorkflowResponse(updated)
  }
)
