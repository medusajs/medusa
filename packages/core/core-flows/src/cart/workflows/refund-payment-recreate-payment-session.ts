import type {
  BigNumberInput,
  PaymentSessionDTO,
} from "@zjedene-medusa/framework/types"
import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@zjedene-medusa/framework/workflows-sdk"
import { createPaymentSessionsWorkflow } from "../../payment-collection/workflows/create-payment-session"
import { refundPaymentsWorkflow } from "../../payment/workflows/refund-payments"

/**
 * The data to create payment sessions.
 */
export interface refundPaymentAndRecreatePaymentSessionWorkflowInput {
  /**
   * The ID of the payment collection to create payment sessions for.
   */
  payment_collection_id: string
  /**
   * The ID of the payment provider that the payment sessions are associated with.
   * This provider is used to later process the payment sessions and their payments.
   */
  provider_id: string
  /**
   * The ID of the customer that the payment session should be associated with.
   */
  customer_id?: string
  /**
   * Custom data relevant for the payment provider to process the payment session.
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/payment/payment-session#data-property).
   */
  data?: Record<string, unknown>

  /**
   * Additional context that's useful for the payment provider to process the payment session.
   * Currently all of the context is calculated within the workflow.
   */
  context?: Record<string, unknown>

  /**
   * The ID of the payment to refund.
   */
  payment_id: string

  /**
   * The amount to refund.
   */
  amount: BigNumberInput

  /**
   * The note to attach to the refund.
   */
  note?: string
}

export const refundPaymentAndRecreatePaymentSessionWorkflowId =
  "refund-payment-and-recreate-payment-session"
/**
 * This workflow refunds a payment and creates a new payment session.
 *
 * @summary
 *
 * Refund a payment and create a new payment session.
 */
export const refundPaymentAndRecreatePaymentSessionWorkflow = createWorkflow(
  {
    name: refundPaymentAndRecreatePaymentSessionWorkflowId,
  },
  (
    input: WorkflowData<refundPaymentAndRecreatePaymentSessionWorkflowInput>
  ): WorkflowResponse<PaymentSessionDTO> => {
    refundPaymentsWorkflow.runAsStep({
      input: [
        {
          payment_id: input.payment_id,
          note: input.note,
          amount: input.amount,
        },
      ],
    })

    const paymentSession = createPaymentSessionsWorkflow.runAsStep({
      input: {
        payment_collection_id: input.payment_collection_id,
        provider_id: input.provider_id,
        customer_id: input.customer_id,
        data: input.data,
      },
    })

    return new WorkflowResponse(paymentSession)
  }
)
