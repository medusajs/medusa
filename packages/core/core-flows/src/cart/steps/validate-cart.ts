import { isPresent, MedusaError } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

export interface ValidateCartStepInput {
  cart: {
    id: string
    completed_at?: string | Date
  }
}

export const validateCartStepId = "validate-cart"
/**
 * This step validates a cart's before editing it.
 */
export const validateCartStep = createStep(
  validateCartStepId,
  async (data: ValidateCartStepInput) => {
    const { cart } = data

    if (!isPresent(cart)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cart does not exist`
      )
    }

    if (cart.completed_at) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cart ${cart.id} is already completed.`
      )
    }
  }
)
