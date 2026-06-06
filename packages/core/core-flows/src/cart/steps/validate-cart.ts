import type { CartDTO, CartWorkflowDTO } from "@zjedene-medusa/framework/types"
import { MedusaError } from "@zjedene-medusa/framework/utils"
import { createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the cart to validate.
 */
export interface ValidateCartStepInput {
  /**
   * The cart to validate.
   */
  cart: CartWorkflowDTO | CartDTO
}

export const validateCartStepId = "validate-cart"
/**
 * This step validates a cart to ensure it exists and is not completed.
 * If not valid, the step throws an error.
 *
 * :::tip
 *
 * You can use the {@link retrieveCartStep} to retrieve a cart's details.
 *
 * :::
 *
 * @example
 * const data = validateCartStep({
 *   // retrieve the details of the cart from another workflow
 *   // or in another step using the Cart Module's service
 *   cart,
 * })
 */
export const validateCartStep = createStep(
  validateCartStepId,
  async (data: ValidateCartStepInput) => {
    const { cart } = data

    if (cart.completed_at) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cart ${cart.id} is already completed.`
      )
    }
  }
)
