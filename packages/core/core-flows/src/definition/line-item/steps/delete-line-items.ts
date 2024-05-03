import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteLineItemsStepId = "delete-line-items"
export const deleteLineItemsStep = createStep(
  deleteLineItemsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    await service.softDeleteLineItems(ids)

    return new StepResponse(void 0, ids)
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }
    const service = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    await service.restoreLineItems(ids)
  }
)
