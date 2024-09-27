import {
  CreateStockLocationInput,
  IStockLocationService,
} from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

import { Modules } from "@medusajs/framework/utils"

export const createStockLocationsStepId = "create-stock-locations"
/**
 * This step creates one or more stock locations.
 */
export const createStockLocations = createStep(
  createStockLocationsStepId,
  async (data: CreateStockLocationInput[], { container }) => {
    const stockLocationService = container.resolve<IStockLocationService>(
      Modules.STOCK_LOCATION
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

    const stockLocationService = container.resolve(Modules.STOCK_LOCATION)

    await stockLocationService.deleteStockLocations(createdStockLocationIds)
  }
)
