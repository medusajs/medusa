import {
  FilterableStockLocationProps,
  IStockLocationService,
  UpdateStockLocationInput,
} from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/utils"

interface StepInput {
  selector: FilterableStockLocationProps
  update: UpdateStockLocationInput
}

export const updateStockLocationsStepId = "update-stock-locations-step"
export const updateStockLocationsStep = createStep(
  updateStockLocationsStepId,
  async (input: StepInput, { container }) => {
    const stockLocationService = container.resolve<IStockLocationService>(
      ModuleRegistrationName.STOCK_LOCATION
    )
    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      input.update,
    ])

    const dataBeforeUpdate = await stockLocationService.listStockLocations(
      input.selector,
      {
        select: selects,
        relations,
      }
    )

    const updatedStockLocations =
      await stockLocationService.updateStockLocations(
        input.selector,
        input.update
      )

    return new StepResponse(updatedStockLocations, dataBeforeUpdate)
  },
  async (revertInput, { container }) => {
    if (!revertInput?.length) {
      return
    }

    const stockLocationService = container.resolve<IStockLocationService>(
      ModuleRegistrationName.STOCK_LOCATION
    )

    await stockLocationService.upsertStockLocations(
      revertInput.map((item) => ({
        id: item.id,
        name: item.name,
        ...(item.metadata ? { metadata: item.metadata } : {}),
        ...(item.address ? { address: item.address } : {}),
      }))
    )
  }
)
