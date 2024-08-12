import { IOrderModuleService, UpdateOrderChangeDTO } from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateOrderChangesStepId = "update-order-shopping-methods"
/**
 * This step updates order change.
 */
export const updateOrderChangesStep = createStep(
  updateOrderChangesStepId,
  async (data: UpdateOrderChangeDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data, {
      objectFields: ["metadata"],
    })

    const dataBeforeUpdate = await service.listOrderChanges(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updated = await service.updateOrderChanges(data)

    return new StepResponse(updated, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.updateOrderChanges(dataBeforeUpdate as UpdateOrderChangeDTO[])
  }
)
