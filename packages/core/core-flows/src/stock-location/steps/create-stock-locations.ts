import {
  CreateStockLocationInput,
  IStockLocationServiceNext,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const createStockLocationsStepId = "create-stock-locations"
export const createStockLocations = createStep(
  createStockLocationsStepId,
  async (data: CreateStockLocationInput[], { container }) => {
    const stockLocationService = container.resolve<IStockLocationServiceNext>(
      ModuleRegistrationName.STOCK_LOCATION
    )

    const created = await stockLocationService.create(data)

    return new StepResponse(
      created,
      created.map((i) => i.id)
    )
  },
  async (createdStockLocationIds, { container }) => {
    if (!createdStockLocationIds?.length) {
      return
    }

    const stockLocationService = container.resolve(
      ModuleRegistrationName.STOCK_LOCATION
    )

    await stockLocationService.delete(createdStockLocationIds)
  }
)
