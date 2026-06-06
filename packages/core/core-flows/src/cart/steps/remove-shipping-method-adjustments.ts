import type { ICartModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the shipping method adjustments to remove.
 */
export interface RemoveShippingMethodAdjustmentsStepInput {
  /**
   * The IDs of the shipping method adjustments to remove.
   */
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

    if (!shippingMethodAdjustmentIdsToRemove?.length) {
      return new StepResponse(void 0, [])
    }

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
