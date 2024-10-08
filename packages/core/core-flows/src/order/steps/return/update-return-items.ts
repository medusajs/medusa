import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface UpdateReturnItemBySelector {
  id: string
  [key: string]: any
}

export const updateReturnItemsStepId = "update-return-items"
/**
 * This step updates return items.
 */
export const updateReturnItemsStep = createStep(
  updateReturnItemsStepId,
  async (data: UpdateReturnItemBySelector[], { container }) => {
    const service = container.resolve(Modules.ORDER) as any

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data, {
      objectFields: ["metadata"],
    })
    const dataBeforeUpdate = await service.listReturnItems(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updated = await service.updateReturnItems(data)

    return new StepResponse(updated, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate?.length) {
      return
    }

    const service = container.resolve(Modules.ORDER) as any

    await service.updateReturnItems(dataBeforeUpdate)
  }
)
