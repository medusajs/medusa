import { ICartModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface RemoveShippingMethodAdjustmentsStepInput {
  shippingMethodAdjustmentIdsToRemove: string[]
}

export const removeShippingMethodAdjustmentsStepId =
  "remove-shipping-method-adjustments"
/**
 * This step removes shipping method adjustments from a cart.
 */
export const removeShippingMethodAdjustmentsStep = createStep(
  removeShippingMethodAdjustmentsStepId,
  async (data: RemoveShippingMethodAdjustmentsStepInput, { container }) => {
    const { shippingMethodAdjustmentIdsToRemove = [] } = data
    const cartModuleService: ICartModuleService = container.resolve(
      Modules.CART
    )

    await cartModuleService.softDeleteShippingMethodAdjustments(
      shippingMethodAdjustmentIdsToRemove
    )

    return new StepResponse(void 0, shippingMethodAdjustmentIdsToRemove)
  },
  async (shippingMethodAdjustmentIdsToRemove, { container }) => {
    const cartModuleService: ICartModuleService = container.resolve(
      Modules.CART
    )

    if (!shippingMethodAdjustmentIdsToRemove?.length) {
      return
    }

    await cartModuleService.restoreShippingMethodAdjustments(
      shippingMethodAdjustmentIdsToRemove
    )
  }
)
