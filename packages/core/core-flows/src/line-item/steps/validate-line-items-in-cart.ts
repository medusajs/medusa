import type { ICartModuleService } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The line items to validate against a cart.
 */
export type ValidateLineItemsInCartStepInput = {
  /**
   * The cart's ID.
   */
  cart_id: string
  /**
   * The IDs of the line items to validate.
   */
  ids: string[]
}

export const validateLineItemsInCartStepId = "validate-line-items-in-cart"
/**
 * This step validates that the given line items belong to the cart.
 * It throws a NOT_FOUND error when any of the line items isn't in the cart.
 */
export const validateLineItemsInCartStep = createStep(
  validateLineItemsInCartStepId,
  async (input: ValidateLineItemsInCartStepInput, { container }) => {
    const service = container.resolve<ICartModuleService>(Modules.CART)

    const uniqueIds = [...new Set(input.ids)]

    const items = await service.listLineItems({
      id: uniqueIds,
      cart_id: input.cart_id,
    })

    if (items.length !== uniqueIds.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Line items with ids ${input.ids.join(", ")} were not found in cart ${input.cart_id}`
      )
    }

    return new StepResponse(void 0)
  }
)
