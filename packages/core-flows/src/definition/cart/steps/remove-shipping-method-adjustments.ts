import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  shippingMethodAdjustmentIdsToRemove: string[]
}

export const removeShippingMethodAdjustmentsStepId =
  "remove-shipping-method-adjustments"
export const removeShippingMethodAdjustmentsStep = createStep(
  removeShippingMethodAdjustmentsStepId,
  async (data: StepInput, { container }) => {
    const { shippingMethodAdjustmentIdsToRemove = [] } = data
    const cartModuleService: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )

    await cartModuleService.softDeleteShippingMethodAdjustments(
      shippingMethodAdjustmentIdsToRemove
    )

    return new StepResponse(void 0, shippingMethodAdjustmentIdsToRemove)
  },
  async (shippingMethodAdjustmentIdsToRemove, { container }) => {
    const cartModuleService: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )

    if (!shippingMethodAdjustmentIdsToRemove?.length) {
      return
    }

    await cartModuleService.restoreShippingMethodAdjustments(
      shippingMethodAdjustmentIdsToRemove
    )
  }
)
