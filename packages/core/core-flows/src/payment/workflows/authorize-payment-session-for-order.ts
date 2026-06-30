import { MedusaError, PaymentSessionStatus } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { addOrderTransactionStep } from "../../order/steps/add-order-transaction"
import { authorizePaymentSessionStep } from "../steps"

/**
 * The data to authorize a pending payment session for an existing order.
 */
export type AuthorizePaymentSessionForOrderInput = {
  /**
   * The ID of the payment session to authorize.
   */
  payment_session_id: string
}

const validatePendingAuthorizationStepId = "validate-pending-authorization-step"
/**
 * This step validates that the payment session is in pending_authorization status.
 */
const validatePendingAuthorizationStep = createStep(
  validatePendingAuthorizationStepId,
  async (input: { status: string; payment_session_id: string }) => {
    if (input.status !== PaymentSessionStatus.PENDING_AUTHORIZATION) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Payment session ${input.payment_session_id} is not in pending_authorization status`
      )
    }

    return new StepResponse(void 0)
  }
)

export const authorizePaymentSessionForOrderWorkflowId =
  "authorize-payment-session-for-order"
/**
 * This workflow authorizes a payment session that is in pending_authorization status,
 * typically triggered by an admin action when a deferred payment (bank transfer,
 * payment link) needs to be manually checked or authorized.
 *
 * If the provider confirms authorization, a Payment record is created and order
 * transactions are added for any captures. If the provider still returns
 * pending_authorization, no changes are made.
 *
 * @summary
 *
 * Authorize a pending payment session for an existing order.
 */
export const authorizePaymentSessionForOrderWorkflow = createWorkflow(
  authorizePaymentSessionForOrderWorkflowId,
  (input: WorkflowData<AuthorizePaymentSessionForOrderInput>) => {
    const { data: paymentSession } = useQueryGraphStep({
      entity: "payment_session",
      fields: ["id", "status", "payment_collection_id"],
      filters: { id: input.payment_session_id },
      options: { throwIfKeyNotFound: true, isList: false },
    }).config({ name: "get-payment-session" })

    validatePendingAuthorizationStep({
      status: paymentSession.status,
      payment_session_id: input.payment_session_id,
    })

    const payment = authorizePaymentSessionStep({
      id: input.payment_session_id,
    })

    const { data: orderPaymentCollection } = useQueryGraphStep({
      entity: "order_payment_collection",
      fields: ["order.id"],
      filters: {
        payment_collection_id: paymentSession.payment_collection_id,
      },
      options: { isList: false },
    }).config({ name: "get-order-payment-collection" })

    when(
      "add-order-transactions",
      { payment, orderPaymentCollection },
      ({ payment, orderPaymentCollection }) => {
        return !!payment && !!orderPaymentCollection?.order?.id
      }
    ).then(() => {
      const orderTransactions = transform(
        { payment, orderPaymentCollection },
        ({ payment, orderPaymentCollection }) => {
          return (
            payment?.captures?.map((capture) => {
              return {
                order_id: orderPaymentCollection.order.id,
                amount: capture.amount,
                currency_code: payment.currency_code,
                reference_id: capture.id,
                reference: "capture",
              }
            }) ?? []
          )
        }
      )

      addOrderTransactionStep(orderTransactions)
    })

    return new WorkflowResponse(payment)
  }
)
