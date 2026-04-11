import {
  IOrderModuleService,
  UpdateOrderChangeDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The order changes to update.
 */
export type UpdateOrderChangesStepInput = UpdateOrderChangeDTO[]

export const updateOrderChangesStepId = "update-order-changes"
/**
 * This step updates order change.
 */
export const updateOrderChangesStep = createStep(
  updateOrderChangesStepId,
  async (data: UpdateOrderChangesStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    if (!data.length) {
      return new StepResponse([], [])
    }

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

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.updateOrderChanges(dataBeforeUpdate as UpdateOrderChangeDTO[])
  }
)
