import type { IOrderModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of deleting order change actions.
 */
export interface DeleteOrderChangeActionsStepInput {
  /**
   * The IDs of the order change actions to delete.
   */
  ids: string[]
}

export const deleteOrderChangeActionsStepId = "delete-order-change-actions"
/**
 * This step deletes order change actions.
 */
export const deleteOrderChangeActionsStep = createStep(
  deleteOrderChangeActionsStepId,
  async (data: DeleteOrderChangeActionsStepInput, { container }) => {
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
