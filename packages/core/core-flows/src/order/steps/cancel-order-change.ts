import {
  CancelOrderChangeDTO,
  IOrderModuleService,
  UpdateOrderChangeDTO,
} from "@medusajs/types"
import {
  ModuleRegistrationName,
  deduplicate,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

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

    selects.push(
      "order_id",
      "return_id",
      "claim_id",
      "exchange_id",
      "version",
      "canceled_at",
      "cancelled_by"
    )

    const dataBeforeUpdate = await service.retrieveOrderChange(data.id, {
      select: deduplicate(selects),
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
