import type { CartWorkflowDTO } from "@medusajs/framework/types"
import {
  isPresent,
  MathBN,
  MedusaError,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The cart's details.
 */
export interface ValidateCartPaymentsStepInput {
  /**
   * The cart to validate payment sessions for.
   */
  cart: CartWorkflowDTO
}

export const validateCartPaymentsStepId = "validate-cart-payments"
/**
 * This step validates a cart's payment sessions. Their status must
 * be `pending`, `requires_more`, `authorized`, or `captured`. If not valid, the step throws an error.
 *
 * :::tip
 *
 * You can use the {@link retrieveCartStep} to retrieve a cart's details.
 *
 * :::
 *
 * @example
 * const data = validateCartPaymentsStep({
 *   // retrieve the details of the cart from another workflow
 *   // or in another step using the Cart Module's service
 *   cart
 * })
 */
export const validateCartPaymentsStep = createStep(
  validateCartPaymentsStepId,
  async (data: ValidateCartPaymentsStepInput) => {
    const {
      cart: {
        payment_collection: paymentCollection,
        total,
        raw_total: rawTotal,
        credit_line_total,
      },
    } = data

    const canSkipPayment =
      MathBN.convert(credit_line_total).gte(0) && MathBN.convert(total).lte(0)

    if (canSkipPayment) {
      return new StepResponse([])
    }

    if (!isPresent(paymentCollection)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Payment collection has not been initiated for cart`
      )
    }

    // We check if any of these payment sessions are present in the cart
    // If not, we throw an error for the consumer to provide a processable payment session
    const processablePaymentStatuses = [
      PaymentSessionStatus.PENDING,
      PaymentSessionStatus.REQUIRES_MORE,
      PaymentSessionStatus.AUTHORIZED, // E.g. payment was authorized, but the cart was not completed
      PaymentSessionStatus.CAPTURED, // E.g. payment was captured, but the cart was not completed
      PaymentSessionStatus.PENDING_AUTHORIZATION, // E.g. async payment method, authorization is deferred
    ]

    const paymentsToProcess = paymentCollection.payment_sessions?.filter((ps) =>
      processablePaymentStatuses.includes(ps.status as PaymentSessionStatus)
    )

    if (!paymentsToProcess?.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Payment sessions are required to complete cart`
      )
    }

    // The payment sessions' amounts are locked in when they are created, so a cart
    // whose total increased afterwards (e.g. taxes calculated after the session was
    // created) would otherwise be completed while being underpaid.
    const authorizedAmount = paymentsToProcess.reduce(
      (sum, ps) => MathBN.add(sum, (ps as any).raw_amount ?? ps.amount ?? 0),
      MathBN.convert(0)
    )

    if (MathBN.lt(authorizedAmount, rawTotal ?? total)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The payment sessions of the cart do not cover its total. Refresh the cart's payment collection and try again.`
      )
    }

    return new StepResponse(paymentsToProcess)
  }
)
