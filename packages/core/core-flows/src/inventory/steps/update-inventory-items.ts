import { IInventoryService, InventoryTypes } from "@medusajs/types"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/utils"

export const updateInventoryItemsStepId = "update-inventory-items-step"
export const updateInventoryItemsStep = createStep(
  updateInventoryItemsStepId,
  async (input: InventoryTypes.UpdateInventoryItemInput[], { container }) => {
    const inventoryService = container.resolve<IInventoryService>(
      ModuleRegistrationName.INVENTORY
    )
    const { selects, relations } = getSelectsAndRelationsFromObjectArray(input)

    const dataBeforeUpdate = await inventoryService.listInventoryItems(
      { id: input.map(({ id }) => id) },
      {}
    )

    const updatedInventoryItems = await inventoryService.updateInventoryItems(
      input
    )

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

    const inventoryService = container.resolve<IInventoryService>(
      ModuleRegistrationName.INVENTORY
    )

    await inventoryService.updateInventoryItems(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      )
    )
  }
)
