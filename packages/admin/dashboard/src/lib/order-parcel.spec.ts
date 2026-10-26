import { describe, expect, it } from "vitest"
import { computeOrderParcel } from "./order-parcel"

type TestItem = Parameters<typeof computeOrderParcel>[0][number]

const makeItem = (
  quantity: number,
  fulfilled: number,
  variant: {
    weight?: number | null
    length?: number | null
    width?: number | null
    height?: number | null
  } | null = {}
): TestItem =>
  ({
    quantity,
    detail: { fulfilled_quantity: fulfilled },
    variant: variant
      ? {
          weight: null,
          length: null,
          width: null,
          height: null,
          ...variant,
        }
      : null,
  } as unknown as TestItem)

describe("computeOrderParcel", () => {
  it("sums weight across unfulfilled items, multiplied by remaining quantity", () => {
    const result = computeOrderParcel([
      makeItem(2, 0, { weight: 10 }),
      makeItem(1, 0, { weight: 5 }),
    ])

    expect(result.weight).toBe(25)
  })

  it("takes dimensions from the item with the largest volume", () => {
    const result = computeOrderParcel([
      makeItem(1, 0, { length: 2, width: 2, height: 2 }),
      makeItem(1, 0, { length: 10, width: 1, height: 1 }),
    ])

    expect(result.length).toBe(10)
    expect(result.width).toBe(1)
    expect(result.height).toBe(1)
  })

  it("returns null for a dimension when no unfulfilled item has it set", () => {
    const result = computeOrderParcel([
      makeItem(1, 0, { weight: 3, length: 4, width: 5, height: null }),
      makeItem(1, 0, { weight: 2, length: null, width: null, height: null }),
    ])

    expect(result.weight).toBe(5)
    expect(result.length).toBe(4)
    expect(result.width).toBe(5)
    expect(result.height).toBeNull()
  })

  it("excludes already-fulfilled items from the computation", () => {
    const result = computeOrderParcel([
      makeItem(2, 2, { weight: 100, length: 50, width: 50, height: 50 }),
      makeItem(1, 0, { weight: 4, length: 3, width: 2, height: 1 }),
    ])

    expect(result.weight).toBe(4)
    expect(result.length).toBe(3)
    expect(result.width).toBe(2)
    expect(result.height).toBe(1)
  })

  it("only counts the remaining quantity of partially fulfilled items", () => {
    const result = computeOrderParcel([makeItem(5, 3, { weight: 2 })])

    expect(result.weight).toBe(4)
  })

  it("ignores items without a variant", () => {
    const result = computeOrderParcel([
      makeItem(1, 0, null),
      makeItem(1, 0, { weight: 7 }),
    ])

    expect(result.weight).toBe(7)
  })

  it("returns all nulls when there are no unfulfilled items", () => {
    const result = computeOrderParcel([
      makeItem(1, 1, { weight: 1, length: 1, width: 1, height: 1 }),
    ])

    expect(result).toEqual({
      weight: null,
      length: null,
      width: null,
      height: null,
    })
  })
})
