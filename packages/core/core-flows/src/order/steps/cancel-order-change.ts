import { CancelOrderChangeDTO, IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const cancelOrderChangeStepId = "cancel-order-change"
export const cancelOrderChangeStep = createStep(
  cancelOrderChangeStepId,
  async (data: CancelOrderChangeDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const dataBeforeUpdate = await service.retrieveOrderChange(data.id, {
      select: ["status", "metadata"],
    })

    await service.cancelOrderChange(data)

    return new StepResponse(void 0, {
      id: data.id,
      status: dataBeforeUpdate.status,
      canceled_at: null,
      canceled_by: null,
      metadata: dataBeforeUpdate.metadata,
    })
  },
  async (rollbackData, { container }) => {
    if (!rollbackData) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.updateOrderChanges(rollbackData)
  }
)
