import type { BigNumberInput } from "@medusajs/framework/types"
import { MathBN } from "@medusajs/framework/utils"

/**
 * The available quantity of an inventory item at a stock location.
 */
export interface ReservationLocationAvailability {
  /**
   * The ID of the stock location.
   */
  location_id: string
  /**
   * The quantity available at the stock location, that is the stocked
   * quantity minus the reserved quantity.
   */
  available_quantity: BigNumberInput
}

/**
 * An item to compute reservation allocations for.
 */
export interface ComputeReservationAllocationsItem {
  /**
   * The ID of the line item the reservation belongs to.
   */
  id?: string
  /**
   * The ID of the inventory item to reserve from.
   */
  inventory_item_id: string
  /**
   * The number of inventory units a single line item quantity is equivalent to.
   */
  required_quantity: number
  /**
   * Whether the variant can be ordered even if it's out of stock.
   */
  allow_backorder: boolean
  /**
   * The line item quantity to reserve.
   */
  quantity: BigNumberInput
  /**
   * The IDs of the candidate stock locations, in order of preference.
   */
  location_ids: string[]
  /**
   * The availability of the inventory item at the candidate stock locations.
   */
  location_availability?: ReservationLocationAvailability[]
}

/**
 * How much of an item's quantity to reserve at a stock location.
 */
export interface ReservationAllocationTarget {
  /**
   * The ID of the stock location to reserve at.
   */
  location_id: string
  /**
   * The inventory quantity to reserve at the stock location.
   */
  quantity: BigNumberInput
}

/**
 * The stock locations to reserve an item's quantity at.
 */
export interface ReservationAllocation {
  /**
   * The ID of the line item the reservation belongs to.
   */
  line_item_id?: string
  /**
   * The ID of the inventory item to reserve from.
   */
  inventory_item_id: string
  /**
   * The reservations to create for the item. The quantities are in inventory
   * units (line item quantity multiplied by `required_quantity`) and must add
   * up to the item's full required total.
   */
  allocations: ReservationAllocationTarget[]
}

/**
 * Computes at which stock locations each item's quantity should be reserved.
 *
 * By default the full quantity is reserved at the first candidate location.
 * When no single location can cover an item's full quantity but the aggregate
 * across the candidate locations can, the reservation is split: locations are
 * filled greedily in the order they appear in `location_ids`, each receiving
 * the largest whole multiple of `required_quantity` it can hold, until the
 * full quantity is covered.
 *
 * If even the aggregate availability can't cover the item, the full quantity
 * is allocated to the first candidate location, so that creating the
 * reservation raises the inventory module's insufficient-inventory error —
 * the same failure as before allocations were introduced.
 *
 * The function is pure, so hook handlers customizing reservation allocations
 * can call it to compute the default plan and adjust it.
 */
export function computeReservationAllocations(
  items: ComputeReservationAllocationsItem[]
): ReservationAllocation[] {
  return items.map((item) => {
    const totalQuantity = MathBN.mult(item.required_quantity, item.quantity)

    const fallbackAllocation: ReservationAllocation = {
      line_item_id: item.id,
      inventory_item_id: item.inventory_item_id,
      allocations: [
        { location_id: item.location_ids[0], quantity: totalQuantity },
      ],
    }

    if (
      item.allow_backorder ||
      item.location_ids.length <= 1 ||
      !item.location_availability?.length
    ) {
      return fallbackAllocation
    }

    const availabilityByLocation = new Map(
      item.location_availability.map((level) => [
        level.location_id,
        level.available_quantity,
      ])
    )

    // The candidate list is ordered by preference, so when the first
    // location can cover the full quantity there is nothing to split.
    const firstAvailability = availabilityByLocation.get(item.location_ids[0])
    if (
      firstAvailability !== undefined &&
      MathBN.gte(firstAvailability, totalQuantity)
    ) {
      return fallbackAllocation
    }

    let remainingUnits: BigNumberInput = item.quantity
    const allocations: ReservationAllocationTarget[] = []

    for (const locationId of item.location_ids) {
      if (MathBN.lte(remainingUnits, 0)) {
        break
      }

      const available = availabilityByLocation.get(locationId)
      if (available === undefined || MathBN.lte(available, 0)) {
        continue
      }

      // Allocate whole line item units only, so every location's share
      // is a multiple of required_quantity and can be fulfilled without
      // leaving fractional units behind.
      const availableUnits = MathBN.div(
        MathBN.sub(available, MathBN.mod(available, item.required_quantity)),
        item.required_quantity
      )
      if (MathBN.lte(availableUnits, 0)) {
        continue
      }

      const unitsToTake = MathBN.min(availableUnits, remainingUnits)

      allocations.push({
        location_id: locationId,
        quantity: MathBN.mult(unitsToTake, item.required_quantity),
      })

      remainingUnits = MathBN.sub(remainingUnits, unitsToTake)
    }

    if (MathBN.gt(remainingUnits, 0)) {
      // Not even the aggregate can cover the item. Reserve everything at
      // the first candidate location so the inventory module raises its
      // usual insufficient-inventory error instead of a partial
      // reservation being written.
      return fallbackAllocation
    }

    return {
      line_item_id: item.id,
      inventory_item_id: item.inventory_item_id,
      allocations,
    }
  })
}
