import { IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const deleteReturnsStepId = "delete-return"
export const deleteReturnsStep = createStep(
  deleteReturnsStepId,
  async (data: { ids: string[] }, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const ids = data.ids.filter(Boolean)

    const deleted = ids.length ? await service.softDeleteReturns(ids) : []

    return new StepResponse(deleted, data.ids)
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.restoreReturns(ids)
  }
)
