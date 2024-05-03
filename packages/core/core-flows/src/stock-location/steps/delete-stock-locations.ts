import {
  DeleteEntityInput,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/modules-sdk"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteStockLocationsStepId = "delete-stock-locations-step"
export const deleteStockLocationsStep = createStep(
  deleteStockLocationsStepId,
  async (input: string[], { container }) => {
    const service = container.resolve(ModuleRegistrationName.STOCK_LOCATION)

    const softDeletedEntities = await service.softDelete(input)

    return new StepResponse(
      {
        [Modules.STOCK_LOCATION]: softDeletedEntities,
      } as DeleteEntityInput,
      input
    )
  },
  async (deletedLocationIds, { container }) => {
    if (!deletedLocationIds?.length) {
      return
    }
    const service = container.resolve(ModuleRegistrationName.STOCK_LOCATION)

    await service.restore(deletedLocationIds)
  }
)
