import {
  IStockLocationServiceNext,
  UpdateStockLocationNextInput,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const updateStockLocationsStepId = "update-stock-locations-step"
export const updateStockLocationsStep = createStep(
  updateStockLocationsStepId,
  async (input: UpdateStockLocationNextInput[], { container }) => {
    const stockLocationService = container.resolve<IStockLocationServiceNext>(
      ModuleRegistrationName.STOCK_LOCATION
    )
    const { selects, relations } = getSelectsAndRelationsFromObjectArray(input)

    const dataBeforeUpdate = await stockLocationService.list(
      { id: input.map(({ id }) => id) },
      {}
    )

    const updatedStockLocations = await stockLocationService.update(input)

    return new StepResponse(updatedStockLocations, {
      dataBeforeUpdate,
      selects,
      relations,
    })
  },
  async (revertInput, { container }) => {
    if (!revertInput?.dataBeforeUpdate?.length) {
      return
    }

    const { dataBeforeUpdate, selects, relations } = revertInput

    const stockLocationService = container.resolve<IStockLocationServiceNext>(
      ModuleRegistrationName.STOCK_LOCATION
    )

    await stockLocationService.update(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      )
    )
  }
)
