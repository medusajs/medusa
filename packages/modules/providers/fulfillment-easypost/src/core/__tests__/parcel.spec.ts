import { CartPropsForFulfillment } from "@medusajs/types"
import { buildParcel } from "../parcel"

const defaults = { weight: 16, length: 10, width: 8, height: 4 }

describe("buildParcel", () => {
  test("sums real per-item weight across quantity, and takes the largest single item's dimensions rather than summing them", () => {
    const items = [
      { quantity: 2, variant: { weight: 8, length: 10, width: 6, height: 2 } },
      { quantity: 1, variant: { weight: 4, length: 5, width: 5, height: 5 } },
    ] as unknown as CartPropsForFulfillment["items"]

    const parcel = buildParcel(items, defaults)

    // Weight sums per quantity: 2*8 + 1*4 = 20.
    expect(parcel.weight).toBe(20)
    // By volume, item 2 (5*5*5=125) is larger than item 1 (10*6*2=120), so
    // its dimensions are used for the parcel rather than a naive sum.
    expect(parcel.length).toBe(5)
    expect(parcel.width).toBe(5)
    expect(parcel.height).toBe(5)
  })

  test("falls back to the configured default parcel for an item missing every weight/dimension field", () => {
    const items = [
      {
        quantity: 1,
        variant: { weight: null, length: null, width: null, height: null },
      },
    ] as unknown as CartPropsForFulfillment["items"]

    const parcel = buildParcel(items, defaults)

    expect(parcel).toEqual(defaults)
  })

  test("falls back per-field when only some dimensions are missing on an item", () => {
    const items = [
      {
        quantity: 1,
        variant: { weight: 8, length: null, width: 6, height: 2 },
      },
    ] as unknown as CartPropsForFulfillment["items"]

    const parcel = buildParcel(items, defaults)

    expect(parcel.weight).toBe(8)
    expect(parcel.length).toBe(10) // fallback, since this one field was null
    expect(parcel.width).toBe(6)
    expect(parcel.height).toBe(2)
  })

  test("falls back to the full default parcel when there are no items", () => {
    const parcel = buildParcel(
      [] as unknown as CartPropsForFulfillment["items"],
      defaults
    )

    expect(parcel).toEqual(defaults)
  })
})
