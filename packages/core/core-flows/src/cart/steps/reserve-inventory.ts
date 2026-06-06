import { MathBN, Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"
import type { BigNumberInput } from "@zjedene-medusa/framework/types"

/**
 * The details of the items and their quantity to reserve.
 */
export interface ReserveVariantInventoryStepInput {
  items: {
    /**
     * The ID for the line item.
     */
    id?: string

    /**
     * The ID of the inventory item to reserve quantities from.
     */
    inventory_item_id: string

    /**
     * The number of units a single quantity is equivalent to. For example, if a customer orders one quantity of the variant, Medusa checks the availability of the quantity multiplied by the
     * value set for `required_quantity`. When the customer orders the quantity, Medusa reserves the ordered quantity multiplied by the value set for `required_quantity`.
     */
    required_quantity: number

    /**
     * Whether the variant can be ordered even if it's out of stock.
     */
    allow_backorder: boolean

    /**
     * The quantity to reserve.
     */
    quantity: BigNumberInput

    /**
     * The IDs of stock locations to reserve the item's quantity in.
     */
    location_ids: string[]
  }[]
}

export const reserveInventoryStepId = "reserve-inventory-step"
/**
 * This step reserves the quantity of line items from the associated
 * variant's inventory.
 *
 * @example
 * const data = reserveInventoryStep({
 *   "items": [{
 *     "inventory_item_id": "iitem_123",
 *     "required_quantity": 1,
 *     "allow_backorder": false,
 *     "quantity": 1,
 *     "location_ids": [
 *       "sloc_123"
 *     ]
 *   }]
 * })
 */
export const reserveInventoryStep = createStep(
  reserveInventoryStepId,
  async (data: ReserveVariantInventoryStepInput, { container }) => {
    if (!data.items.length) {
      return new StepResponse([], {
        reservations: [],
        inventoryItemIds: [],
      })
    }

    const inventoryService = container.resolve(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const inventoryItemIds: string[] = []

    const items = data.items.map((item) => {
      inventoryItemIds.push(item.inventory_item_id)

      return {
        line_item_id: item.id,
        inventory_item_id: item.inventory_item_id,
        quantity: MathBN.mult(item.required_quantity, item.quantity),
        allow_backorder: item.allow_backorder,
        location_id: item.location_ids[0],
      }
    })

    const lockingKeys = Array.from(new Set(inventoryItemIds))

    const reservations = await locking.execute(lockingKeys, async () => {
      return await inventoryService.createReservationItems(items)
    })

    return new StepResponse(reservations, {
      reservations: reservations.map((r) => r.id),
      inventoryItemIds,
    })
  },
  async (data, { container }) => {
    if (!data?.reservations?.length) {
      return
    }

    const inventoryService = container.resolve(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const inventoryItemIds = data.inventoryItemIds
    const lockingKeys = Array.from(new Set(inventoryItemIds))

    await locking.execute(lockingKeys, async () => {
      await inventoryService.deleteReservationItems(data.reservations)
    })

    return new StepResponse()
  }
)
