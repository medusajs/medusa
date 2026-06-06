import { DeleteEntityInput } from "@zjedene-medusa/framework/modules-sdk"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of stock locations to delete.
 */
export type DeleteStockLocationsStepInput = string[]

export const deleteStockLocationsStepId = "delete-stock-locations-step"
/**
 * This step deletes one or more stock locations.
 */
export const deleteStockLocationsStep = createStep(
  deleteStockLocationsStepId,
  async (input: DeleteStockLocationsStepInput, { container }) => {
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
