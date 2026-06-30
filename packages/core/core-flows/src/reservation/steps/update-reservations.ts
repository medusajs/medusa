import type {
  IInventoryService,
  InventoryTypes,
} from "@medusajs/framework/types"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

import { Modules } from "@medusajs/framework/utils"

/**
 * The data to update reservation items.
 */
export type UpdateReservationsStepInput =
  InventoryTypes.UpdateReservationItemInput[]

export const updateReservationsStepId = "update-reservations-step"

type UpdateReservationsCompensationInput = {
  dataBeforeUpdate: InventoryTypes.ReservationItemDTO[]
  selects: string[]
  relations: string[]
  inventoryItemIds: string[]
}

/**
 * This step updates one or more reservations.
 *
 * @example
 * const data = updateReservationsStep([
 *   {
 *     id: "res_123",
 *     quantity: 1,
 *   }
 * ])
 */
export const updateReservationsStep = createStep(
  updateReservationsStepId,
  async (data: UpdateReservationsStepInput, { container }) => {
    const inventoryModuleService = container.resolve<IInventoryService>(
      Modules.INVENTORY
    )
    const locking = container.resolve(Modules.LOCKING)

    if (!data.length) {
      return new StepResponse<
        InventoryTypes.ReservationItemDTO[],
        UpdateReservationsCompensationInput
      >([], {
        dataBeforeUpdate: [],
        selects: [],
        relations: [],
        inventoryItemIds: [],
      })
    }

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)
    const selectsWithInventoryItem = Array.from(
      new Set([...selects, "inventory_item_id"])
    )

    const dataBeforeUpdate = await inventoryModuleService.listReservationItems(
      { id: data.map((d) => d.id) },
      { relations, select: selectsWithInventoryItem }
    )

    const inventoryItemIds = dataBeforeUpdate.map((r) => r.inventory_item_id)
    const lockingKeys = Array.from(new Set(inventoryItemIds))

    const updatedReservations = await locking.execute(lockingKeys, async () => {
      return await inventoryModuleService.updateReservationItems(data)
    })

    return new StepResponse(updatedReservations, {
      dataBeforeUpdate,
      selects,
      relations,
      inventoryItemIds,
    })
  },
  async (revertInput, { container }) => {
    if (!revertInput) {
      return
    }

    const {
      dataBeforeUpdate = [],
      selects,
      relations,
      inventoryItemIds = [],
    } = revertInput

    const inventoryModuleService = container.resolve<IInventoryService>(
      Modules.INVENTORY
    )
    const locking = container.resolve(Modules.LOCKING)

    const lockingKeys = Array.from(new Set(inventoryItemIds))

    await locking.execute(lockingKeys, async () => {
      await inventoryModuleService.updateReservationItems(
        dataBeforeUpdate.map((data) =>
          convertItemResponseToUpdateRequest(data, selects, relations)
        )
      )
    })
  }
)
