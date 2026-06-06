import type { InventoryTypes } from "@zjedene-medusa/framework/types"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

import { Modules } from "@zjedene-medusa/framework/utils"

/**
 * The data to create reservation items.
 */
export type CreateReservationsStepInput =
  InventoryTypes.CreateReservationItemInput[]

export const createReservationsStepId = "create-reservations-step"
/**
 * This step creates one or more reservations.
 *
 * @example
 * const data = createReservationsStep([
 *   {
 *     inventory_item_id: "iitem_123",
 *     location_id: "sloc_123",
 *     quantity: 1,
 *   }
 * ])
 */
export const createReservationsStep = createStep(
  createReservationsStepId,
  async (data: CreateReservationsStepInput, { container }) => {
    const service = container.resolve(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const inventoryItemIds = data.map((item) => item.inventory_item_id)

    const lockingKeys = Array.from(new Set(inventoryItemIds))

    const created = await locking.execute(lockingKeys, async () => {
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
    const lockingKeys = Array.from(new Set(inventoryItemIds))

    await locking.execute(lockingKeys, async () => {
      await service.deleteReservationItems(data.reservations)
    })
  }
)
