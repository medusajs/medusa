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
    const service = container.resolve<IInventoryService>(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const reservations = await service.listReservationItems(
      { line_item_id: ids },
      { select: ["id", "inventory_item_id"] }
    )

    const inventoryItemIds = reservations.map((r) => r.inventory_item_id)
    const lockingKeys = Array.from(new Set(inventoryItemIds))

    await locking.execute(lockingKeys, async () => {
      await service.deleteReservationItemsByLineItem(ids)
    })

    return new StepResponse(void 0, { ids, inventoryItemIds })
  },
  async (data, { container }) => {
    if (!data?.ids?.length) {
      return
    }

    const service = container.resolve<IInventoryService>(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const lockingKeys = Array.from(new Set(data.inventoryItemIds))

    await locking.execute(lockingKeys, async () => {
      await service.restoreReservationItemsByLineItem(data.ids)
    })
  }
)
