import { IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const deleteOrderChangeActionsStepId = "delete-order-change-actions"
/**
 * This step deletes order change actions.
 */
export const deleteOrderChangeActionsStep = createStep(
  deleteOrderChangeActionsStepId,
  async (data: { ids: string[] }, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.softDeleteOrderChangeActions(data.ids)

    return new StepResponse(void 0, data.ids)
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.restoreOrderChangeActions(ids)
  }
)
