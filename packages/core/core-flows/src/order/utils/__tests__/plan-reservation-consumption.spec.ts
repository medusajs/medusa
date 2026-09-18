import type { ReservationItemDTO } from "@medusajs/framework/types"
import { planReservationConsumption } from "../plan-reservation-consumption"

const reservation = (
  id: string,
  locationId: string,
  quantity: number
): ReservationItemDTO =>
  ({
    id,
    location_id: locationId,
    quantity,
  } as unknown as ReservationItemDTO)

const toPlain = (plan: ReturnType<typeof planReservationConsumption>) => ({
  entries: plan.entries.map((entry) => ({
    id: entry.reservation.id,
    quantity: Number(entry.quantity.toString()),
  })),
  shortfall: Number(plan.shortfall.toString()),
})

describe("planReservationConsumption", () => {
  it("consumes a single reservation up to the needed quantity", () => {
    const plan = planReservationConsumption({
      reservations: [reservation("res_1", "sl_a", 5)],
      quantity: 3,
      preferredLocationId: "sl_a",
    })

    expect(toPlain(plan)).toEqual({
      entries: [{ id: "res_1", quantity: 3 }],
      shortfall: 0,
    })
  })

  it("consumes reservations at the preferred location first", () => {
    const plan = planReservationConsumption({
      reservations: [
        reservation("res_a", "sl_a", 1),
        reservation("res_b", "sl_b", 1),
      ],
      quantity: 1,
      preferredLocationId: "sl_b",
    })

    expect(toPlain(plan)).toEqual({
      entries: [{ id: "res_b", quantity: 1 }],
      shortfall: 0,
    })
  })

  it("falls back to reservations at other locations when the preferred location does not cover the needed quantity", () => {
    const plan = planReservationConsumption({
      reservations: [
        reservation("res_a", "sl_a", 1),
        reservation("res_b", "sl_b", 1),
      ],
      quantity: 2,
      preferredLocationId: "sl_b",
    })

    expect(toPlain(plan)).toEqual({
      entries: [
        { id: "res_b", quantity: 1 },
        { id: "res_a", quantity: 1 },
      ],
      shortfall: 0,
    })
  })

  it("keeps the original order when no preferred location is given", () => {
    const plan = planReservationConsumption({
      reservations: [
        reservation("res_a", "sl_a", 1),
        reservation("res_b", "sl_b", 2),
      ],
      quantity: 3,
    })

    expect(toPlain(plan)).toEqual({
      entries: [
        { id: "res_a", quantity: 1 },
        { id: "res_b", quantity: 2 },
      ],
      shortfall: 0,
    })
  })

  it("reports a shortfall when the reservations cannot cover the needed quantity", () => {
    const plan = planReservationConsumption({
      reservations: [
        reservation("res_a", "sl_a", 1),
        reservation("res_b", "sl_b", 1),
      ],
      quantity: 4,
      preferredLocationId: "sl_a",
    })

    expect(toPlain(plan)).toEqual({
      entries: [
        { id: "res_a", quantity: 1 },
        { id: "res_b", quantity: 1 },
      ],
      shortfall: 2,
    })
  })

  it("skips empty reservations", () => {
    const plan = planReservationConsumption({
      reservations: [
        reservation("res_a", "sl_a", 0),
        reservation("res_b", "sl_a", 2),
      ],
      quantity: 2,
      preferredLocationId: "sl_a",
    })

    expect(toPlain(plan)).toEqual({
      entries: [{ id: "res_b", quantity: 2 }],
      shortfall: 0,
    })
  })
})
