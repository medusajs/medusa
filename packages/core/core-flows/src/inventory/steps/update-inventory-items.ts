import type {
  IInventoryService,
  InventoryTypes,
} from "@zjedene-medusa/framework/types"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

import { Modules } from "@zjedene-medusa/framework/utils"

/**
 * The data to update the inventory items.
 */
export type UpdateInventoryItemsStepInput =
  InventoryTypes.UpdateInventoryItemInput[]

export const updateInventoryItemsStepId = "update-inventory-items-step"
/**
 * This step updates one or more inventory items.
 */
export const updateInventoryItemsStep = createStep(
  updateInventoryItemsStepId,
  async (input: UpdateInventoryItemsStepInput, { container }) => {
    const inventoryService = container.resolve<IInventoryService>(
      Modules.INVENTORY
    )

    if (!input.length) {
      return new StepResponse([], {
        dataBeforeUpdate: [],
        selects: [],
        relations: [],
      })
    }

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
      Modules.INVENTORY
    )

    await inventoryService.updateInventoryItems(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      )
    )
  }
)
