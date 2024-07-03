import { IInventoryService, InventoryTypes } from "@medusajs/types"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/utils"

export const updateReservationsStepId = "update-reservations-step"
export const updateReservationsStep = createStep(
  updateReservationsStepId,
  async (data: InventoryTypes.UpdateReservationItemInput[], { container }) => {
    const inventoryModuleService = container.resolve<IInventoryService>(
      ModuleRegistrationName.INVENTORY
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)
    const dataBeforeUpdate = await inventoryModuleService.listReservationItems(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updatedReservations =
      await inventoryModuleService.updateReservationItems(data)

    return new StepResponse(updatedReservations, {
      dataBeforeUpdate,
      selects,
      relations,
    })
  },
  async (revertInput, { container }) => {
    if (!revertInput) {
      return
    }

    const { dataBeforeUpdate = [], selects, relations } = revertInput

    const inventoryModuleService = container.resolve<IInventoryService>(
      ModuleRegistrationName.INVENTORY
    )

    await inventoryModuleService.updateReservationItems(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      )
    )
  }
)
