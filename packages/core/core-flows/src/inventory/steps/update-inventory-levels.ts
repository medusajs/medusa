import { IInventoryService, InventoryTypes } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const updateInventoryLevelsStepId = "update-inventory-levels-step"
export const updateInventoryLevelsStep = createStep(
  updateInventoryLevelsStepId,
  async (
    input: InventoryTypes.BulkUpdateInventoryLevelInput[],
    { container }
  ) => {
    const inventoryService: IInventoryService = container.resolve(
      ModuleRegistrationName.INVENTORY
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(input)

    const dataBeforeUpdate = await inventoryService.listInventoryLevels(
      {
        $or: input.map(({ inventory_item_id, location_id }) => ({
          inventory_item_id,
          location_id,
        })),
      },
      {}
    )

    const updatedLevels: InventoryTypes.InventoryLevelDTO[] =
      await inventoryService.updateInventoryLevels(input)

    return new StepResponse(updatedLevels, {
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

    const inventoryService = container.resolve(ModuleRegistrationName.INVENTORY)

    await inventoryService.updateInventoryLevels(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      ) as InventoryTypes.BulkUpdateInventoryLevelInput[]
    )
  }
)
