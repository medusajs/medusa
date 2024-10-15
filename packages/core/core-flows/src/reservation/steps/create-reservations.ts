import { InventoryTypes } from "@medusajs/framework/types"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { Modules } from "@medusajs/framework/utils"

export const createReservationsStepId = "create-reservations-step"
/**
 * This step creates one or more reservations.
 */
export const createReservationsStep = createStep(
  createReservationsStepId,
  async (data: InventoryTypes.CreateReservationItemInput[], { container }) => {
    const service = container.resolve(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const inventoryItemIds = data.map((item) => item.inventory_item_id)

    const created = await locking.execute(inventoryItemIds, async () => {
      return await service.createReservationItems(data)
    })

    return new StepResponse(created, {
      reservations: created.map((reservation) => reservation.id),
      inventoryItemIds: inventoryItemIds,
    })
  },
  async (data, { container }) => {
    if (!data?.reservations?.length) {
      return
    }

    const service = container.resolve(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const inventoryItemIds = data.inventoryItemIds
    await locking.execute(inventoryItemIds, async () => {
      await service.deleteReservationItems(data.reservations)
    })
  }
)
