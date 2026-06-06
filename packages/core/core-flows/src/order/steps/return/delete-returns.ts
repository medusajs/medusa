import type { IOrderModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of deleting the returns.
 */
export type DeleteReturnStepInput = {
  /**
   * The IDs of the returns to delete.
   */
  ids: string[]
}

export const deleteReturnsStepId = "delete-return"
/**
 * This step deletes one or more returns.
 */
export const deleteReturnsStep = createStep(
  deleteReturnsStepId,
  async (data: DeleteReturnStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const ids = data.ids.filter(Boolean)

    const deleted = ids.length ? await service.softDeleteReturns(ids) : []

    return new StepResponse(deleted, data.ids)
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.restoreReturns(ids)
  }
)
