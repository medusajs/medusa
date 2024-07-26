import { UpdateReturnDTO } from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateReturnsStepId = "update-returns"
export const updateReturnsStep = createStep(
  updateReturnsStepId,
  async (data: UpdateReturnDTO[], { container }) => {
    const service = container.resolve(ModuleRegistrationName.ORDER) as any

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

    const service = container.resolve(ModuleRegistrationName.ORDER) as any

    await service.updateReturns(dataBeforeUpdate)
  }
)
