import {
  CancelOrderChangeDTO,
  IOrderModuleService,
  UpdateOrderChangeDTO,
} from "@medusajs/types"
import {
  getSelectsAndRelationsFromObjectArray,
  ModuleRegistrationName,
} from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const cancelOrderChangeStepId = "cancel-order-change"
export const cancelOrderChangeStep = createStep(
  cancelOrderChangeStepId,
  async (data: CancelOrderChangeDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(
      [data],
      { objectFields: ["metadata"] }
    )

    const dataBeforeUpdate = await service.retrieveOrderChange(data.id, {
      select: [...selects, "canceled_at"],
      relations,
    })

    await service.cancelOrderChange(data)

    return new StepResponse(void 0, dataBeforeUpdate)
  },
  async (rollbackData, { container }) => {
    if (!rollbackData) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.updateOrderChanges(rollbackData as UpdateOrderChangeDTO)
  }
)
