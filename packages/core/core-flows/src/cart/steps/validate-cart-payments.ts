import { CartWorkflowDTO } from "@medusajs/framework/types"
import {
  isPresent,
  MedusaError,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export interface ValidateCartPaymentsStepInput {
  cart: CartWorkflowDTO
}

export const validateCartPaymentsStepId = "validate-cart-payments"
/**
 * This step validates a cart's payment sessions. Their status must
 * be `pending` or `requires_more`.
 */
export const validateCartPaymentsStep = createStep(
  validateCartPaymentsStepId,
  async (data: ValidateCartPaymentsStepInput) => {
    const {
      cart: { payment_collection: paymentCollection },
    } = data

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

    return new StepResponse(paymentsToProcess)
  }
)
