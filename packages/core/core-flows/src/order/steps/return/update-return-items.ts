import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of updating the return items.
 */
export type UpdateReturnItemBySelector = {
  /**
   * The ID of the return item to update.
   */
  id: string
  /**
   * The data to update in the return item.
   */
  [key: string]: any
}[]

export const updateReturnItemsStepId = "update-return-items"
/**
 * This step updates return items.
 * 
 * @example
 * const data = updateReturnItemsStep([
 *   {
 *     id: "orli_123",
 *     quantity: 2
 *   }
 * ])
 */
export const updateReturnItemsStep = createStep(
  updateReturnItemsStepId,
  async (data: UpdateReturnItemBySelector, { container }) => {
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
