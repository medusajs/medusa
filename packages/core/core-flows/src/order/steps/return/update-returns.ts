import { UpdateReturnDTO } from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const updateReturnsStepId = "update-returns"
/**
 * This step updates one or more returns.
 */
export const updateReturnsStep = createStep(
  updateReturnsStepId,
  async (data: UpdateReturnDTO[], { container }) => {
    const service = container.resolve(Modules.ORDER) as any

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data, {
      objectFields: ["metadata"],
    })
    const dataBeforeUpdate = await service.listReturns(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updated = await service.updateReturns(data)

    return new StepResponse(updated, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate?.length) {
      return
    }

    const service = container.resolve(Modules.ORDER) as any

    await service.updateReturns(dataBeforeUpdate)
  }
)
