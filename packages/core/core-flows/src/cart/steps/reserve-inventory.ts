import { MathBN, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import type {
  BigNumberInput,
  IInventoryService,
  InventoryTypes,
} from "@medusajs/framework/types"

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
 * When an item's `location_ids` contains more than one location and no
 * single location can fulfill the entire required quantity on its own,
 * the reservation is split across locations: the step greedily reserves
 * up to each location's currently available quantity, in the order the
 * locations appear in `location_ids`, until the required total is met.
 * Variants with `allow_backorder` keep the previous behavior of
 * reserving from the first listed location.
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

    const inventoryItemIds: string[] = data.items.map(
      (i) => i.inventory_item_id
    )
    const lockingKeys = Array.from(new Set(inventoryItemIds))

    const reservations = await locking.execute(lockingKeys, async () => {
      const reservationInputs = await buildReservationInputs(
        data.items,
        inventoryService
      )
      return await inventoryService.createReservationItems(reservationInputs)
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

async function buildReservationInputs(
  items: ReserveVariantInventoryStepInput["items"],
  inventoryService: IInventoryService
): Promise<InventoryTypes.CreateReservationItemInput[]> {
  // Items that can potentially be split across locations: managed inventory
  // (no backorder) with more than one candidate location.
  const itemsToSplit = items.filter(
    (i) => !i.allow_backorder && i.location_ids.length > 1
  )

  let availabilityByKey: Map<string, BigNumberInput> | null = null
  if (itemsToSplit.length) {
    const inventoryItemIds = Array.from(
      new Set(itemsToSplit.map((i) => i.inventory_item_id))
    )
    const locationIds = Array.from(
      new Set(itemsToSplit.flatMap((i) => i.location_ids))
    )

    const levels = await inventoryService.listInventoryLevels({
      inventory_item_id: inventoryItemIds,
      location_id: locationIds,
    })

    availabilityByKey = new Map(
      levels.map((l) => [
        availabilityKey(l.inventory_item_id, l.location_id),
        MathBN.sub(l.stocked_quantity, l.reserved_quantity),
      ])
    )
  }

  const result: InventoryTypes.CreateReservationItemInput[] = []

  for (const item of items) {
    const totalNeeded = MathBN.mult(item.required_quantity, item.quantity)

    // Single-location, backorder, or no availability data: keep existing
    // behavior of reserving the full quantity at the first listed location.
    if (
      item.allow_backorder ||
      item.location_ids.length <= 1 ||
      !availabilityByKey
    ) {
      result.push({
        line_item_id: item.id,
        inventory_item_id: item.inventory_item_id,
        quantity: totalNeeded,
        allow_backorder: item.allow_backorder,
        location_id: item.location_ids[0],
      })
      continue
    }

    // Greedy-fill in **line-item units** (not raw inventory units) so
    // each location's allocation is always a whole multiple of
    // `required_quantity`. Allocating raw units directly would produce
    // reservations that can't be cleanly consumed at fulfillment time
    // (e.g. with required_quantity=3 a 4-unit allocation can't be
    // mapped to an integer number of line-item units).
    let remainingUnits: BigNumberInput = item.quantity
    const splitEntries: InventoryTypes.CreateReservationItemInput[] = []
    for (const locationId of item.location_ids) {
      if (MathBN.lte(remainingUnits, 0)) {
        break
      }

      const available = availabilityByKey.get(
        availabilityKey(item.inventory_item_id, locationId)
      )
      if (available === undefined || MathBN.lte(available, 0)) {
        continue
      }

      // How many whole line-item units fit at this location given the
      // required_quantity multiplier. Compute the largest multiple of
      // required_quantity that is ≤ available, then divide.
      const remainder = MathBN.mod(available, item.required_quantity)
      const usable = MathBN.sub(available, remainder)
      if (MathBN.lte(usable, 0)) {
        continue
      }
      const availableUnits = MathBN.div(usable, item.required_quantity)

      const takeUnits = MathBN.lte(availableUnits, remainingUnits)
        ? availableUnits
        : remainingUnits
      splitEntries.push({
        line_item_id: item.id,
        inventory_item_id: item.inventory_item_id,
        quantity: MathBN.mult(takeUnits, item.required_quantity),
        allow_backorder: item.allow_backorder,
        location_id: locationId,
      })
      remainingUnits = MathBN.sub(remainingUnits, takeUnits)
    }

    if (MathBN.gt(remainingUnits, 0)) {
      // The aggregated availability across the candidate locations isn't
      // enough to cover the line item. Fall back to a single reservation
      // at the first candidate location for the full needed quantity so
      // that `createReservationItems` raises the standard insufficient
      // inventory error against a real location, preserving the existing
      // error contract.
      result.push({
        line_item_id: item.id,
        inventory_item_id: item.inventory_item_id,
        quantity: totalNeeded,
        allow_backorder: item.allow_backorder,
        location_id: item.location_ids[0],
      })
    } else {
      result.push(...splitEntries)
    }
  }

  return result
}

const availabilityKey = (inventoryItemId: string, locationId: string) =>
  `${inventoryItemId}::${locationId}`
