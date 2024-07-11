import { IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteOrderChangeActionsStepId = "delete-order-change-actions"
export const deleteOrderChangeActionsStep = createStep(
  deleteOrderChangeActionsStepId,
  async (data: { ids: string[] }, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.softDeleteOrderChangeActions(data.ids)

    return new StepResponse(void 0, data.ids)
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.restoreOrderChangeActions(ids)
  }
)
