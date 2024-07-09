import { IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const deleteOrderChangeStepId = "delete-order-change"
export const deleteOrderChangeStep = createStep(
  deleteOrderChangeStepId,
  async (data: { id: string }, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const deleted = await service.softDeleteOrderChanges(data.id)

    return new StepResponse(deleted, data.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.restoreOrderChanges(id)
  }
)
