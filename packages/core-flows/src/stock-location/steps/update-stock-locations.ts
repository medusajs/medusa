import {
  FilterableStockLocationProps,
  IStockLocationServiceNext,
  UpdateStockLocationNextInput,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { UpdateStockLocationInput } from "@medusajs/types"

interface StepInput {
  selector: FilterableStockLocationProps
  update: UpdateStockLocationInput
}

export const updateStockLocationsStepId = "update-stock-locations-step"
export const updateStockLocationsStep = createStep(
  updateStockLocationsStepId,
  async (input: StepInput, { container }) => {
    const stockLocationService = container.resolve<IStockLocationServiceNext>(
      ModuleRegistrationName.STOCK_LOCATION
    )
    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      input.update,
    ])

    const dataBeforeUpdate = await stockLocationService.list(input.selector, {
      select: selects,
      relations,
    })

    const updatedStockLocations = await stockLocationService.update(
      input.selector,
      input.update
    )

    return new StepResponse(updatedStockLocations, dataBeforeUpdate)
  },
  async (revertInput, { container }) => {
    if (!revertInput?.length) {
      return
    }

    const stockLocationService = container.resolve<IStockLocationServiceNext>(
      ModuleRegistrationName.STOCK_LOCATION
    )

    await stockLocationService.upsert(
      revertInput.map((item) => ({
        id: item.id,
        name: item.name,
        ...(item.metadata ? { metadata: item.metadata } : {}),
        ...(item.address ? { address: item.address } : {}),
      }))
    )
  }
)
