import type {
  BigNumberInput,
  ReservationItemDTO,
} from "@medusajs/framework/types"
import { MathBN } from "@medusajs/framework/utils"

/**
 * A quantity to consume from a reservation.
 */
export interface ReservationConsumptionEntry {
  /**
   * The reservation to consume from.
   */
  reservation: ReservationItemDTO
  /**
   * The inventory quantity to consume from the reservation.
   */
  quantity: BigNumberInput
}

/**
 * How a needed inventory quantity is consumed from a set of reservations.
 */
export interface ReservationConsumptionPlan {
  /**
   * The quantities to consume per reservation.
   */
  entries: ReservationConsumptionEntry[]
  /**
   * The quantity that could not be covered by the reservations. Greater than
   * zero when the reservations' total quantity is less than the needed
   * quantity.
   */
  shortfall: BigNumberInput
}

/**
 * Plans how a needed inventory quantity is consumed from a line item's
 * reservations of a single inventory item.
 *
 * A line item can have multiple reservations for the same inventory item when
 * its reservation was split across stock locations. Reservations at the
 * preferred location — typically the location the fulfillment is created at —
 * are consumed first, so reservations at other locations stay untouched for
 * later fulfillments at those locations, unless the needed quantity exceeds
 * what's reserved at the preferred location.
 */
export function planReservationConsumption({
  reservations,
  quantity,
  preferredLocationId,
}: {
  /**
   * The line item's reservations of a single inventory item.
   */
  reservations: ReservationItemDTO[]
  /**
   * The inventory quantity to consume.
   */
  quantity: BigNumberInput
  /**
   * The ID of the stock location whose reservations to consume first.
   */
  preferredLocationId?: string
}): ReservationConsumptionPlan {
  const prioritized = preferredLocationId
    ? // Stable sort: preferred-location reservations first, otherwise the
      // original order is kept.
      [...reservations].sort(
        (a, b) =>
          Number(a.location_id !== preferredLocationId) -
          Number(b.location_id !== preferredLocationId)
      )
    : reservations

  const entries: ReservationConsumptionEntry[] = []
  let remaining: BigNumberInput = quantity

  for (const reservation of prioritized) {
    if (MathBN.lte(remaining, 0)) {
      break
    }

    const quantityToConsume = MathBN.min(remaining, reservation.quantity)
    if (MathBN.lte(quantityToConsume, 0)) {
      continue
    }

    entries.push({ reservation, quantity: quantityToConsume })
    remaining = MathBN.sub(remaining, quantityToConsume)
  }

  return { entries, shortfall: MathBN.max(remaining, 0) }
}
