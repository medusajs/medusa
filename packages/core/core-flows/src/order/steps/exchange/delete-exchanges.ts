import { IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const deleteExchangesStepId = "delete-exchanges"
export const deleteExchangesStep = createStep(
  deleteExchangesStepId,
  async (data: { ids: string[] }, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const deleted = await service.softDeleteOrderExchanges(data.ids)

    return new StepResponse(deleted, data.ids)
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.restoreOrderExchanges(ids)
  }
)
