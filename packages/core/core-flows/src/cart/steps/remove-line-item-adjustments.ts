import type { ICartModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the line item adjustments to remove.
 */
export interface RemoveLineItemAdjustmentsStepInput {
  /**
   * The IDs of the line item adjustments to remove.
   */
  lineItemAdjustmentIdsToRemove: string[]
}

export const removeLineItemAdjustmentsStepId = "remove-line-item-adjustments"
/**
 * This step removes line item adjustments from a cart.
 */
export const removeLineItemAdjustmentsStep = createStep(
  removeLineItemAdjustmentsStepId,
  async (data: RemoveLineItemAdjustmentsStepInput, { container }) => {
    const { lineItemAdjustmentIdsToRemove = [] } = data

    if (!lineItemAdjustmentIdsToRemove?.length) {
      return new StepResponse(void 0, [])
    }

    const cartModuleService: ICartModuleService = container.resolve(
      Modules.CART
    )

    await cartModuleService.softDeleteLineItemAdjustments(
      lineItemAdjustmentIdsToRemove
    )

    return new StepResponse(void 0, lineItemAdjustmentIdsToRemove)
  },
  async (lineItemAdjustmentIdsToRemove, { container }) => {
    const cartModuleService: ICartModuleService = container.resolve(
      Modules.CART
    )

    if (!lineItemAdjustmentIdsToRemove?.length) {
      return
    }

    await cartModuleService.restoreLineItemAdjustments(
      lineItemAdjustmentIdsToRemove
    )
  }
)
