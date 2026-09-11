import { computeReservationAllocations } from "../compute-reservation-allocations"

const toPlain = (allocations: ReturnType<typeof computeReservationAllocations>) =>
  allocations.map((allocation) => ({
    ...allocation,
    allocations: allocation.allocations.map((target) => ({
      location_id: target.location_id,
      quantity: Number(target.quantity.toString()),
    })),
  }))

describe("computeReservationAllocations", () => {
  it("allocates the full quantity to the first location for single-location items", () => {
    const result = computeReservationAllocations([
      {
        id: "li_1",
        inventory_item_id: "ii_1",
        required_quantity: 1,
        allow_backorder: false,
        quantity: 2,
        location_ids: ["sl_a"],
        location_availability: [
          { location_id: "sl_a", available_quantity: 1 },
        ],
      },
    ])

    expect(toPlain(result)).toEqual([
      {
        line_item_id: "li_1",
        inventory_item_id: "ii_1",
        allocations: [{ location_id: "sl_a", quantity: 2 }],
      },
    ])
  })

  it("allocates the full quantity to the first location for backorder items", () => {
    const result = computeReservationAllocations([
      {
        id: "li_1",
        inventory_item_id: "ii_1",
        required_quantity: 1,
        allow_backorder: true,
        quantity: 3,
        location_ids: ["sl_a", "sl_b"],
        location_availability: [
          { location_id: "sl_a", available_quantity: 0 },
          { location_id: "sl_b", available_quantity: 0 },
        ],
      },
    ])

    expect(toPlain(result)[0].allocations).toEqual([
      { location_id: "sl_a", quantity: 3 },
    ])
  })

  it("allocates the full quantity to the first location when no availability data is provided", () => {
    const result = computeReservationAllocations([
      {
        id: "li_1",
        inventory_item_id: "ii_1",
        required_quantity: 1,
        allow_backorder: false,
        quantity: 2,
        location_ids: ["sl_a", "sl_b"],
      },
    ])

    expect(toPlain(result)[0].allocations).toEqual([
      { location_id: "sl_a", quantity: 2 },
    ])
  })

  it("does not split when the first location covers the full quantity", () => {
    const result = computeReservationAllocations([
      {
        id: "li_1",
        inventory_item_id: "ii_1",
        required_quantity: 1,
        allow_backorder: false,
        quantity: 2,
        location_ids: ["sl_a", "sl_b"],
        location_availability: [
          { location_id: "sl_a", available_quantity: 5 },
          { location_id: "sl_b", available_quantity: 5 },
        ],
      },
    ])

    expect(toPlain(result)[0].allocations).toEqual([
      { location_id: "sl_a", quantity: 2 },
    ])
  })

  it("splits across locations when no single location can cover the full quantity (issue #14987)", () => {
    const result = computeReservationAllocations([
      {
        id: "li_1",
        inventory_item_id: "ii_1",
        required_quantity: 1,
        allow_backorder: false,
        quantity: 2,
        location_ids: ["sl_a", "sl_b"],
        location_availability: [
          { location_id: "sl_a", available_quantity: 1 },
          { location_id: "sl_b", available_quantity: 1 },
        ],
      },
    ])

    expect(toPlain(result)[0].allocations).toEqual([
      { location_id: "sl_a", quantity: 1 },
      { location_id: "sl_b", quantity: 1 },
    ])
  })

  it("skips locations without availability while splitting", () => {
    const result = computeReservationAllocations([
      {
        id: "li_1",
        inventory_item_id: "ii_1",
        required_quantity: 1,
        allow_backorder: false,
        quantity: 3,
        location_ids: ["sl_a", "sl_b", "sl_c"],
        location_availability: [
          { location_id: "sl_a", available_quantity: 1 },
          { location_id: "sl_b", available_quantity: 0 },
          { location_id: "sl_c", available_quantity: 2 },
        ],
      },
    ])

    expect(toPlain(result)[0].allocations).toEqual([
      { location_id: "sl_a", quantity: 1 },
      { location_id: "sl_c", quantity: 2 },
    ])
  })

  it("keeps each location's split quantity a whole multiple of required_quantity", () => {
    // 2 line item units × required_quantity 3 = 6 inventory units needed.
    // sl_a holds 4 (1 whole unit + remainder), sl_b holds 5 (1 whole unit
    // + remainder). The split must take 3 from each location — never
    // 4 + 2, which couldn't be fulfilled in whole line item units.
    const result = computeReservationAllocations([
      {
        id: "li_1",
        inventory_item_id: "ii_1",
        required_quantity: 3,
        allow_backorder: false,
        quantity: 2,
        location_ids: ["sl_a", "sl_b"],
        location_availability: [
          { location_id: "sl_a", available_quantity: 4 },
          { location_id: "sl_b", available_quantity: 5 },
        ],
      },
    ])

    expect(toPlain(result)[0].allocations).toEqual([
      { location_id: "sl_a", quantity: 3 },
      { location_id: "sl_b", quantity: 3 },
    ])
  })

  it("falls back to the first location when the aggregate availability is insufficient", () => {
    const result = computeReservationAllocations([
      {
        id: "li_1",
        inventory_item_id: "ii_1",
        required_quantity: 1,
        allow_backorder: false,
        quantity: 5,
        location_ids: ["sl_a", "sl_b"],
        location_availability: [
          { location_id: "sl_a", available_quantity: 1 },
          { location_id: "sl_b", available_quantity: 1 },
        ],
      },
    ])

    expect(toPlain(result)[0].allocations).toEqual([
      { location_id: "sl_a", quantity: 5 },
    ])
  })

  it("falls back when no location can hold a whole line item unit even though the aggregate looks sufficient", () => {
    // required_quantity 5, quantity 1 → 5 inventory units needed. Each
    // location holds 4: the aggregate (8) covers the requirement, but no
    // location can hold a whole unit.
    const result = computeReservationAllocations([
      {
        id: "li_1",
        inventory_item_id: "ii_1",
        required_quantity: 5,
        allow_backorder: false,
        quantity: 1,
        location_ids: ["sl_a", "sl_b"],
        location_availability: [
          { location_id: "sl_a", available_quantity: 4 },
          { location_id: "sl_b", available_quantity: 4 },
        ],
      },
    ])

    expect(toPlain(result)[0].allocations).toEqual([
      { location_id: "sl_a", quantity: 5 },
    ])
  })
})
