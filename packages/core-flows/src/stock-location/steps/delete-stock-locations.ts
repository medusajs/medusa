import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const deleteStockLocationsStepId = "delete-stock-locations-step"
export const deleteStockLocationsStep = createStep(
  deleteStockLocationsStepId,
  async (input: string[], { container }) => {
    const service = container.resolve(ModuleRegistrationName.STOCK_LOCATION)

    await service.softDelete(input)

    return new StepResponse(void 0, input)
  },
  async (deletedLocationIds, { container }) => {
    if (!deletedLocationIds?.length) {
      return
    }
    const service = container.resolve(ModuleRegistrationName.STOCK_LOCATION)

    await service.restore(deletedLocationIds)
  }
)
