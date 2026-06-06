import type { IOrderModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of deleting one or more exchanges.
 */
export type DeleteOrderExchangesInput = {
  /**
   * The IDs of the exchanges to delete.
   */
  ids: string[]
}

export const deleteExchangesStepId = "delete-exchanges"
/**
 * This step deletes one or more exchanges.
 */
export const deleteExchangesStep = createStep(
  deleteExchangesStepId,
  async (data: DeleteOrderExchangesInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const deleted = await service.softDeleteOrderExchanges(data.ids)

    return new StepResponse(deleted, data.ids)
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.restoreOrderExchanges(ids)
  }
)
