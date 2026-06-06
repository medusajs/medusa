import {
  CreateStockLocationInput,
  IStockLocationService,
} from "@zjedene-medusa/framework/types"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

import { Modules } from "@zjedene-medusa/framework/utils"

/**
 * The stock locations to create.
 */
export type CreateStockLocationsStepInput = CreateStockLocationInput[]

export const createStockLocationsStepId = "create-stock-locations"
/**
 * This step creates one or more stock locations.
 */
export const createStockLocations = createStep(
  createStockLocationsStepId,
  async (data: CreateStockLocationsStepInput, { container }) => {
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
