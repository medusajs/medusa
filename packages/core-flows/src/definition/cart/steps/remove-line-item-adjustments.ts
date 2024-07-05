import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  lineItemAdjustmentIdsToRemove: string[]
}

export const removeLineItemAdjustmentsStepId = "remove-line-item-adjustments"
export const removeLineItemAdjustmentsStep = createStep(
  removeLineItemAdjustmentsStepId,
  async (data: StepInput, { container }) => {
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
