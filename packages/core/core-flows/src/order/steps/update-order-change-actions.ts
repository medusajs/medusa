import {
  IOrderModuleService,
  UpdateOrderChangeActionDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  deduplicate,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const updateOrderChangeActionsStepId = "update-order-change-actions"
/**
 * This step updates order change actions.
 */
export const updateOrderChangeActionsStep = createStep(
  updateOrderChangeActionsStepId,
  async (data: UpdateOrderChangeActionDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data, {
      objectFields: ["metadata", "details"],
    })
    selects.push(
      "order_id",
      "return_id",
      "claim_id",
      "exchange_id",
      "version",
      "order_change_id"
    )

    const dataBeforeUpdate = await service.listOrderChangeActions(
      { id: data.map((d) => d.id) },
      { relations, select: deduplicate(selects) }
    )

    const updated = await service.updateOrderChangeActions(data)

    return new StepResponse(updated, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.updateOrderChangeActions(dataBeforeUpdate)
  }
)
