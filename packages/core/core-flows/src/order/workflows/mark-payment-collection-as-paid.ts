import { PaymentCollectionDTO } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { createPaymentSessionsWorkflow } from "../../definition"
import {
  authorizePaymentSessionStep,
  capturePaymentWorkflow,
} from "../../payment"

/**
 * This step validates that the payment collection is not_paid
 */
export const throwUnlessPaymentCollectionNotPaid = createStep(
  "validate-existing-payment-collection",
  ({ paymentCollection }: { paymentCollection: PaymentCollectionDTO }) => {
    if (paymentCollection.status !== "not_paid") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Can only mark 'not_paid' payment collection as paid`
      )
    }
  }
)

const systemPaymentProviderId = "pp_system_default"
export const markPaymentCollectionAsPaidId = "mark-payment-collection-as-paid"
/**
 * This workflow marks a payment collection for an order as paid.
 */
export const markPaymentCollectionAsPaid = createWorkflow(
  markPaymentCollectionAsPaidId,
  (
    input: WorkflowData<{
      payment_collection_id: string
      order_id: string
    }>
  ) => {
    const paymentCollection = useRemoteQueryStep({
      entry_point: "payment_collection",
      fields: ["id", "status", "amount"],
      variables: { id: input.payment_collection_id },
      throw_if_key_not_found: true,
      list: false,
    })

    throwUnlessPaymentCollectionNotPaid({ paymentCollection })

    const paymentSession = createPaymentSessionsWorkflow.runAsStep({
      input: {
        payment_collection_id: paymentCollection.id,
        provider_id: systemPaymentProviderId,
        data: {},
        context: {},
      },
    })

    const payment = authorizePaymentSessionStep({
      id: paymentSession.id,
      context: { order_id: input.order_id },
    })

    capturePaymentWorkflow.runAsStep({
      input: {
        payment_id: payment.id,
        captured_by: "req.auth_context.actor_id",
        amount: paymentCollection.amount,
      },
    })

    return new WorkflowResponse(payment)
  }
)
