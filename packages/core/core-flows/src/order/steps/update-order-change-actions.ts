import {
  IOrderModuleService,
  UpdateOrderChangeActionDTO,
} from "@medusajs/types"
import {
  getSelectsAndRelationsFromObjectArray,
  ModuleRegistrationName,
} from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const updateOrderChangeActionsStepId = "update-order-change-actions"
export const updateOrderChangeActionsStep = createStep(
  updateOrderChangeActionsStepId,
  async (data: UpdateOrderChangeActionDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data, {
      objectFields: ["metadata"],
    })
    const dataBeforeUpdate = await service.listOrderChangeActions(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updated = await service.updateOrderChangeActions(data)

    return new StepResponse(updated, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.updateOrderChangeActions(dataBeforeUpdate)
  }
)
