import {
  CancelOrderChangeDTO,
  IOrderModuleService,
  UpdateOrderChangeDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  deduplicate,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const cancelOrderChangeStepId = "cancel-order-change"
/**
 * This step cancels an order change.
 */
export const cancelOrderChangeStep = createStep(
  cancelOrderChangeStepId,
  async (data: CancelOrderChangeDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

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
      "canceled_by"
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

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.updateOrderChanges(rollbackData as UpdateOrderChangeDTO)
  }
)
