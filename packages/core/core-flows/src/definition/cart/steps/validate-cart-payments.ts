import { CartWorkflowDTO } from "@medusajs/types"
import { isPresent, MedusaError, PaymentSessionStatus } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

interface StepInput {
  cart: CartWorkflowDTO
}

export const validateCartPaymentsStepId = "validate-cart-payments"
export const validateCartPaymentsStep = createStep(
  validateCartPaymentsStepId,
  async (data: StepInput) => {
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
    ]

    const paymentsToProcess = paymentCollection.payment_sessions?.filter((ps) =>
      processablePaymentStatuses.includes(ps.status)
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
