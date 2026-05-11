import type { CartWorkflowDTO } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The input for the validate cart items step.
 *
 * @since 2.14.3
 */
export interface ValidateCartItemsStepInput {
  /**
   * The cart to validate.
   */
  cart: CartWorkflowDTO
}

/**
 * The ID of the validate cart items step.
 *
 * @since 2.14.3
 */
export const validateCartItemsStepId = "validate-cart-items"
/**
 * This step validates that a cart has at least one line item before
 * completing the cart and placing an order. If the cart has no items,
 * the step throws an error.
 *
 * @example
 * validateCartItemsStep({
 *   cart
 * })
 *
 * @since 2.14.3
 */
export const validateCartItemsStep = createStep(
  validateCartItemsStepId,
  async (data: ValidateCartItemsStepInput) => {
    const { cart } = data

    if (!cart.items?.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot complete a cart with no items`
      )
    }

    return new StepResponse(void 0)
  }
)
