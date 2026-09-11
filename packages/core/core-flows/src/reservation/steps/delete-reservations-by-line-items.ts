import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

import type { IInventoryService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * The IDs of the line items to delete reservations for.
 */
export type DeleteReservationsByLineItemsStepInput = string[]

export const deleteReservationsByLineItemsStepId =
  "delete-reservations-by-line-items"
/**
 * This step deletes reservations by their associated line items.
 */
export const deleteReservationsByLineItemsStep = createStep(
  deleteReservationsByLineItemsStepId,
  async (ids: DeleteReservationsByLineItemsStepInput, { container }) => {
    if (!ids?.length) {
      return new StepResponse([], {
        ids: [],
        inventoryItemIds: [],
        reservationIds: [],
      })
    }

    const service = container.resolve<IInventoryService>(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const reservations = await service.listReservationItems(
      { line_item_id: ids },
      { select: ["id", "inventory_item_id"] }
    )

    const reservationIds = reservations.map((r) => r.id)
    const inventoryItemIds = reservations.map((r) => r.inventory_item_id)
    const lockingKeys = Array.from(new Set(inventoryItemIds))

    if (reservationIds.length) {
      await locking.execute(lockingKeys, async () => {
        await service.deleteReservationItemsByLineItem(ids)
      })
    }

    return new StepResponse(reservationIds, {
      ids,
      inventoryItemIds,
      reservationIds,
    })
  },
  async (data, { container }) => {
    if (!data?.reservationIds?.length) {
      return
    }

    const service = container.resolve<IInventoryService>(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const lockingKeys = Array.from(new Set(data.inventoryItemIds))

    await locking.execute(lockingKeys, async () => {
      await service.restoreReservationItems(data.reservationIds)
    })
  }
)
