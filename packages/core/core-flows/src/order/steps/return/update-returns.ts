import type { UpdateReturnDTO } from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The returns to update.
 */
export type UpdateReturnsStepInput = UpdateReturnDTO[]

export const updateReturnsStepId = "update-returns"
/**
 * This step updates one or more returns.
 */
export const updateReturnsStep = createStep(
  updateReturnsStepId,
  async (data: UpdateReturnsStepInput, { container }) => {
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
