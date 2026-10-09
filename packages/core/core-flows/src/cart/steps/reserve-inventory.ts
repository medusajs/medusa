import { MathBN, MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import type { BigNumberInput } from "@medusajs/framework/types"
import {
  computeReservationAllocations,
  type ReservationAllocation,
  type ReservationLocationAvailability,
} from "../utils/compute-reservation-allocations"

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

    /**
     * The availability of the inventory item at the candidate stock locations.
     * When provided, the step can split an item's reservation across multiple
     * locations if no single location covers the full quantity.
     */
    location_availability?: ReservationLocationAvailability[]
  }[]

  /**
   * Custom reservation allocations, overriding how item quantities are
   * distributed across stock locations. Matched to items by `line_item_id`
   * and `inventory_item_id`. Items without a matching allocation use the
   * default behavior. Each allocation's quantities must add up to the item's
   * `required_quantity * quantity`.
   */
  allocations?: ReservationAllocation[]
}

export const reserveInventoryStepId = "reserve-inventory-step"
/**
 * This step reserves the quantity of line items from the associated
 * variant's inventory.
 *
 * By default, an item's full quantity is reserved at the first location in
 * its `location_ids`. When an item provides `location_availability` and no
 * single location can cover its full quantity, the reservation is split
 * across the candidate locations. Custom distributions can be passed through
 * `allocations`, for example from the `setReservationAllocations` hook of
 * the {@link reserveInventoryWorkflow}.
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

    const allocationOverrides = new Map(
      (data.allocations ?? []).map((allocation) => [
        allocationKey(allocation.line_item_id, allocation.inventory_item_id),
        allocation,
      ])
    )

    const items = data.items.flatMap((item) => {
      inventoryItemIds.push(item.inventory_item_id)

      const override = allocationOverrides.get(
        allocationKey(item.id, item.inventory_item_id)
      )

      if (override) {
        validateAllocationOverride(item, override)
      }

      const { allocations } =
        override ?? computeReservationAllocations([item])[0]

      return allocations.map((allocation) => ({
        line_item_id: item.id,
        inventory_item_id: item.inventory_item_id,
        quantity: allocation.quantity,
        allow_backorder: item.allow_backorder,
        location_id: allocation.location_id,
      }))
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

const allocationKey = (
  lineItemId: string | undefined,
  inventoryItemId: string
) => `${lineItemId ?? ""}:${inventoryItemId}`

function validateAllocationOverride(
  item: ReserveVariantInventoryStepInput["items"][0],
  override: ReservationAllocation
): void {
  const totalQuantity = MathBN.mult(item.required_quantity, item.quantity)
  const allocatedQuantity = override.allocations.reduce(
    (sum, allocation) => MathBN.add(sum, allocation.quantity),
    MathBN.convert(0)
  )

  const hasInvalidQuantity = override.allocations.some((allocation) =>
    MathBN.lte(allocation.quantity, 0)
  )

  if (hasInvalidQuantity || !MathBN.eq(allocatedQuantity, totalQuantity)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Reservation allocations for item ${item.id} (inventory item ${item.inventory_item_id}) must consist of positive quantities adding up to ${totalQuantity}.`
    )
  }
}
