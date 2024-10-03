import {
  DeclineOrderChangeDTO,
  IOrderModuleService,
  UpdateOrderChangeDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  deduplicate,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const declineOrderChangeStepId = "decline-order-change"
/**
 * This step declines an order change.
 */
export const declineOrderChangeStep = createStep(
  declineOrderChangeStepId,
  async (data: DeclineOrderChangeDTO, { container }) => {
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
      "declined_at",
      "declined_by",
      "declined_reason"
    )

    const dataBeforeUpdate = await service.retrieveOrderChange(data.id, {
      select: deduplicate(selects),
      relations,
    })

    await service.declineOrderChange(data)

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
