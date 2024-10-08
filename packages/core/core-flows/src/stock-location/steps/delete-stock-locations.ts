import { DeleteEntityInput } from "@medusajs/framework/modules-sdk"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const deleteStockLocationsStepId = "delete-stock-locations-step"
/**
 * This step deletes one or more stock locations.
 */
export const deleteStockLocationsStep = createStep(
  deleteStockLocationsStepId,
  async (input: string[], { container }) => {
    const service = container.resolve(Modules.STOCK_LOCATION)

    const softDeletedEntities = await service.softDeleteStockLocations(input)

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
    const service = container.resolve(Modules.STOCK_LOCATION)

    await service.restoreStockLocations(deletedLocationIds)
  }
)
