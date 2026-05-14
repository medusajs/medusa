import type { WebhookActionResult } from "@medusajs/framework/types"
import { PaymentActions } from "@medusajs/utils"
import { createWorkflow, transform, when } from "@medusajs/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { authorizePaymentSessionStep } from "../steps"
import { completeCartAfterPaymentStep } from "../steps/complete-cart-after-payment"
import { capturePaymentWorkflow } from "./capture-payment"
import { acquireLockStep, releaseLockStep } from "../../locking"

const THIRTY_SECONDS = 30
const TWO_MINUTES = 60 * 2

/**
 * The data to process a payment from a webhook action.
 */
export interface ProcessPaymentWorkflowInput extends WebhookActionResult {}

export const processPaymentWorkflowId = "process-payment-workflow"
/**
 * This workflow processes a payment to either complete its associated cart,
 * capture the payment, or authorize the payment session. It's used when a
 * [Webhook Event is received](https://docs.medusajs.com/resources/commerce-modules/payment/webhook-events).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to process a payment in your custom flows based on a webhook action.
 *
 * @example
 * const { result } = await processPaymentWorkflow(container)
 * .run({
 *   input: {
 *     action: "captured",
 *     data: {
 *       session_id: "payses_123",
 *       amount: 10
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Process a payment based on a webhook event.
 */
export const processPaymentWorkflow = createWorkflow(
  processPaymentWorkflowId,
  (input: ProcessPaymentWorkflowInput) => {
    const paymentData = useQueryGraphStep({
      entity: "payment",
      fields: ["id"],
      filters: { payment_session_id: input.data?.session_id },
    }).config({
      name: "payment-query",
    })

    const paymentSessionResult = useQueryGraphStep({
      entity: "payment_session",
      fields: ["payment_collection_id"],
      filters: { id: input.data?.session_id },
    }).config({
      name: "payment-session-query",
    })

    const cartPaymentCollection = useQueryGraphStep({
      entity: "cart_payment_collection",
      fields: ["cart_id"],
      filters: {
        payment_collection_id:
          paymentSessionResult.data[0].payment_collection_id,
      },
    }).config({
      name: "cart-payment-query",
    })

    const cartId = transform(
      { cartPaymentCollection },
      ({ cartPaymentCollection }) => {
        return cartPaymentCollection.data[0]?.cart_id
      }
    )

    const { data: order } = useQueryGraphStep({
        entity: "order_cart",
        fields: ["id"],
        filters: {
          cart_id: cartId
        },
        options: {
            isList: false
        }
      }).config({
        name: "cart-order-query",
      })

    when("lock-cart-when-available", { cartId }, ({ cartId }) => {
      return !!cartId
    }).then(() => {
      acquireLockStep({
        key: cartId,
        timeout: THIRTY_SECONDS,
        ttl: TWO_MINUTES,
      })
    })

    when({ input, paymentData }, ({ input, paymentData }) => {
      return (
        input.action === PaymentActions.SUCCESSFUL && !!paymentData.data.length
      )
    }).then(() => {
      capturePaymentWorkflow
        .runAsStep({
          input: {
            payment_id: paymentData.data[0].id,
            amount: input.data?.amount,
          },
        })
        .config({
          name: "capture-payment",
        })
    })

    when({ input, paymentData }, ({ input, paymentData }) => {
      // payment is captured with the provider but we dont't have any payment data which means we didn't call authorize yet - autocapture flow
      return (
        input.action === PaymentActions.SUCCESSFUL && !paymentData.data.length
      )
    }).then(() => {
      const payment = authorizePaymentSessionStep({
        id: input.data!.session_id,
        context: {},
      }).config({
        name: "authorize-payment-session-autocapture",
      })

      capturePaymentWorkflow
        .runAsStep({
          input: {
            payment_id: payment.id,
            amount: input.data?.amount,
          },
        })
        .config({
          name: "capture-payment-autocapture",
        })
    })

    when(
      { input, cartPaymentCollection },
      ({ input, cartPaymentCollection }) => {
        // Authorize payment session if no Cart is linked to the payment
        // When associated with a Cart, the complete cart workflow will handle the authorization
        return (
          !cartPaymentCollection.data.length &&
          input.action === PaymentActions.AUTHORIZED &&
          !!input.data?.session_id
        )
      }
    ).then(() => {
      authorizePaymentSessionStep({
        id: input.data!.session_id,
        context: {},
      }).config({
        name: "authorize-payment-session",
      })
    })

    // We release before the completion to prevent dead locks
    when("release-lock-cart-when-available", { cartId }, ({ cartId }) => {
      return !!cartId
    }).then(() => {
      releaseLockStep({
        key: cartId,
      })
    })

    when({ cartPaymentCollection, order }, ({ cartPaymentCollection, order }) => {
      return !!cartPaymentCollection.data.length && !order
    }).then(() => {
      completeCartAfterPaymentStep({
        cart_id: cartPaymentCollection.data[0].cart_id,
      }).config({
        continueOnPermanentFailure: true, // Continue payment processing even if cart completion fails
      })
    })
  }
)
