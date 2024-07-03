import {
  CreateStockLocationInput,
  IStockLocationService,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/utils"

export const createStockLocationsStepId = "create-stock-locations"
export const createStockLocations = createStep(
  createStockLocationsStepId,
  async (data: CreateStockLocationInput[], { container }) => {
    const stockLocationService = container.resolve<IStockLocationService>(
      ModuleRegistrationName.STOCK_LOCATION
    )

    const created = await stockLocationService.createStockLocations(data)

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

    await stockLocationService.deleteStockLocations(createdStockLocationIds)
  }
)
