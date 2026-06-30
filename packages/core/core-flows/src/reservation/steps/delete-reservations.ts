import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

import type { IInventoryService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * The IDs of the reservations to delete.
 */
export type DeleteReservationsStepInput = string[]

export const deleteReservationsStepId = "delete-reservations"
/**
 * This step deletes one or more reservations.
 */
export const deleteReservationsStep = createStep(
  deleteReservationsStepId,
  async (ids: DeleteReservationsStepInput, { container }) => {
    const service = container.resolve<IInventoryService>(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const reservations = await service.listReservationItems(
      { id: ids },
      { select: ["id", "inventory_item_id"] }
    )

    const inventoryItemIds = reservations.map((r) => r.inventory_item_id)
    const lockingKeys = Array.from(new Set(inventoryItemIds))

    await locking.execute(lockingKeys, async () => {
      await service.softDeleteReservationItems(ids)
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
      await service.restoreReservationItems(data.ids)
    })
  }
)
