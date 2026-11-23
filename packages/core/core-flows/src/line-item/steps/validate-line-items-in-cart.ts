import type { ICartModuleService } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The data to validate that line items belong to a cart.
 */
export interface ValidateLineItemsInCartStepInput {
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
 * This step validates that the line items belong to the specified cart.
 * If a line item doesn't exist or belongs to another cart, the step throws an error.
 *
 * @example
 * validateLineItemsInCartStep({
 *   cart_id: "cart_123",
 *   ids: ["li_123"]
 * })
 */
export const validateLineItemsInCartStep = createStep(
  validateLineItemsInCartStepId,
  async (data: ValidateLineItemsInCartStepInput, { container }) => {
    if (!data.ids?.length) {
      return new StepResponse(void 0)
    }

    const service = container.resolve<ICartModuleService>(Modules.CART)

    const items = await service.listLineItems(
      { id: data.ids, cart_id: data.cart_id },
      { select: ["id"] }
    )

    const foundIds = new Set(items.map((item) => item.id))
    const missingId = data.ids.find((id) => !foundIds.has(id))

    if (missingId) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Line item with id: ${missingId} was not found`
      )
    }

    return new StepResponse(void 0)
  }
)
