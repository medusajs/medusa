import {
  DeclineOrderChangeDTO,
  IOrderModuleService,
  UpdateOrderChangeDTO,
} from "@medusajs/types"
import {
  ModuleRegistrationName,
  deduplicate,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const declineOrderChangeStepId = "decline-order-change"
export const declineOrderChangeStep = createStep(
  declineOrderChangeStepId,
  async (data: DeclineOrderChangeDTO, { container }) => {
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

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.updateOrderChanges(rollbackData as UpdateOrderChangeDTO)
  }
)
