import { IInventoryServiceNext, InventoryNext } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const updateInventoryItemsStepId = "update-inventory-items-step"
export const updateInventoryItemsStep = createStep(
  updateInventoryItemsStepId,
  async (input: InventoryNext.UpdateInventoryItemInput[], { container }) => {
    const inventoryService = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )
    const { selects, relations } = getSelectsAndRelationsFromObjectArray(input)

    const dataBeforeUpdate = await inventoryService.list(
      { id: input.map(({ id }) => id) },
      {}
    )

    const updatedInventoryItems = await inventoryService.update(input)

    return new StepResponse(updatedInventoryItems, {
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

    const inventoryService = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    await inventoryService.update(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      )
    )
  }
)
