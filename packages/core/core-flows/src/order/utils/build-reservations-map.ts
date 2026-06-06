import type { ReservationItemDTO } from "@zjedene-medusa/framework/types"

/**
 * Builds a map of reservations by line item id.
 *
 * @param reservations - The reservations to build the map from.
 * @returns A map of reservations by line item id.
 */
export function buildReservationsMap(reservations: ReservationItemDTO[]) {
  const map = new Map<string, ReservationItemDTO[]>()

  for (const reservation of reservations) {
    if (map.has(reservation.line_item_id as string)) {
      map.get(reservation.line_item_id as string)!.push(reservation)
    } else {
      map.set(reservation.line_item_id as string, [reservation])
    }
  }

  return map
}
