import type { Logger } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { refundPaymentAndRecreatePaymentSessionWorkflow } from "../workflows/refund-payment-recreate-payment-session"

/**
 * The payment session's details for compensation.
 */
export interface CompensatePaymentIfNeededStepInput {
  /**
   * The payment to compensate.
   */
  payment_session_id: string
}

export const compensatePaymentIfNeededStepId = "compensate-payment-if-needed"
/**
 * Purpose of this step is to be the last compensation in cart completion workflow.
 * If the cart completion fails, this step tries to cancel or refund the payment.
 *
 * @example
 * const data = compensatePaymentIfNeededStep({
 *   payment_session_id: "pay_123"
 * })
 */
export const compensatePaymentIfNeededStep = createStep(
  compensatePaymentIfNeededStepId,
  async (data: CompensatePaymentIfNeededStepInput, { container }) => {
    const { payment_session_id } = data

    return new StepResponse(payment_session_id)
  },
  async (paymentSessionId, { container }) => {
    if (!paymentSessionId) {
      return
    }

    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: paymentSessions } = await query.graph({
      entity: "payment_session",
      fields: [
        "id",
        "payment_collection_id",
        "amount",
        "raw_amount",
        "provider_id",
        "data",
        "payment.id",
        "payment.captured_at",
        "payment.customer.id",
      ],
      filters: {
        id: paymentSessionId,
      },
    })
    const paymentSession = paymentSessions[0]

    if (!paymentSession) {
      return
    }

    if (paymentSession.payment?.captured_at) {
      const {
        data: [cartPaymentCollectionLink],
      } = await query.graph({
        entity: "cart_payment_collection",
        fields: ["cart_id"],
        filters: {
          payment_collection_id: paymentSession.payment_collection_id,
        },
      })

      const cartId = cartPaymentCollectionLink?.cart_id
      if (cartId) {
        const {
          data: [orderCartLink],
        } = await query.graph({
          entity: "order_cart",
          fields: ["order_id"],
          filters: { cart_id: cartId },
        })

        if (orderCartLink?.order_id) {
          logger.warn(
            `Skipping refund of payment ${paymentSession.payment.id}: a later completion attempt already placed order ${orderCartLink.order_id} for cart ${cartId}.`
          )
          return
        }
      }

      try {
        const workflowInput = {
          payment_collection_id: paymentSession.payment_collection_id,
          provider_id: paymentSession.provider_id,
          customer_id: paymentSession.payment?.customer?.id,
          data: paymentSession.data,
          amount: paymentSession.raw_amount ?? paymentSession.amount,
          payment_id: paymentSession.payment.id,
          note: "Refunded due to cart completion failure",
        }

        await refundPaymentAndRecreatePaymentSessionWorkflow(container).run({
          input: workflowInput,
        })
      } catch (e) {
        logger.error(
          `Error was thrown trying to refund payment - ${paymentSession.payment?.id} - ${e}`
        )
      }
    }
  }
)
