import {
  IStockLocationService,
  UpsertStockLocationAddressInput,
} from "@zjedene-medusa/framework/types"
import {
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

import { Modules } from "@zjedene-medusa/framework/utils"

/**
 * The data to upsert stock location addresses.
 */
export type UpsertStockLocationAddressesStepInput = UpsertStockLocationAddressInput[]

export const upsertStockLocationAddressesStepId =
  "upsert-stock-location-addresses-step"
/**
 * This step upserts stock location addresses matching the specified filters.
 */
export const upsertStockLocationAddressesStep = createStep(
  upsertStockLocationAddressesStepId,
  async (input: UpsertStockLocationAddressInput[], { container }) => {
    const stockLocationService = container.resolve<IStockLocationService>(
      Modules.STOCK_LOCATION
    )

    const stockLocationAddressIds = input.map((i) => i.id!).filter(Boolean)
    const { selects, relations } = getSelectsAndRelationsFromObjectArray(input)

    const dataToUpdate = await stockLocationService.listStockLocationAddresses(
      { id: stockLocationAddressIds },
      { select: selects, relations }
    )

    const updateIds = dataToUpdate.map((du) => du.id)

    const updatedAddresses =
      await stockLocationService.upsertStockLocationAddresses(input)

    const dataToDelete = updatedAddresses.filter(
      (address) => !updateIds.includes(address.id)
    )

    return new StepResponse(updatedAddresses, { dataToUpdate, dataToDelete })
  },
  async (revertData, { container }) => {
    if (!revertData) {
      return
    }

    const stockLocationService = container.resolve<IStockLocationService>(
      Modules.STOCK_LOCATION
    )

    const promises: any[] = []

    if (revertData.dataToDelete) {
      promises.push(
        stockLocationService.deleteStockLocationAddresses(
          revertData.dataToDelete.map((d) => d.id!)
        )
      )
    }

    if (revertData.dataToUpdate) {
      promises.push(
        stockLocationService.upsertStockLocationAddresses(
          revertData.dataToUpdate
        )
      )
    }

    await promiseAll(promises)
  }
)
