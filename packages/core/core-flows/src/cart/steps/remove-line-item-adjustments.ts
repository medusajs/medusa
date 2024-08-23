import { ICartModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export interface RemoveLineItemAdjustmentsStepInput {
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
    const cartModuleService: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )

    await cartModuleService.softDeleteLineItemAdjustments(
      lineItemAdjustmentIdsToRemove
    )

    return new StepResponse(void 0, lineItemAdjustmentIdsToRemove)
  },
  async (lineItemAdjustmentIdsToRemove, { container }) => {
    const cartModuleService: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )

    if (!lineItemAdjustmentIdsToRemove?.length) {
      return
    }

    await cartModuleService.restoreLineItemAdjustments(
      lineItemAdjustmentIdsToRemove
    )
  }
)
