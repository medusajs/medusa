import { IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const deleteOrderChangesStepId = "delete-order-change"
/**
 * This step deletes order changes.
 */
export const deleteOrderChangesStep = createStep(
  deleteOrderChangesStepId,
  async (data: { ids: string[] }, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const deleted = await service.softDeleteOrderChanges(data.ids)

    return new StepResponse(deleted, data.ids)
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.restoreOrderChanges(ids)
  }
)
