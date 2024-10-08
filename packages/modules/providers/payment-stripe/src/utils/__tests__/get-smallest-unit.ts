import { getSmallestUnit } from "../get-smallest-unit"

describe("getSmallestUnit", () => {
  it("should convert an amount to the format required by Stripe based on currency", () => {
    // 0 decimals
    expect(getSmallestUnit(50098, "JPY")).toBe(50098)

    // 3 decimals
    expect(getSmallestUnit(5.124, "KWD")).toBe(5130)

    // 2 decimals
    expect(getSmallestUnit(2.675, "USD")).toBe(268)

    expect(getSmallestUnit(100.54, "USD")).toBe(10054)
    expect(getSmallestUnit(5.126, "KWD")).toBe(5130)
    expect(getSmallestUnit(0.54, "USD")).toBe(54)
    expect(getSmallestUnit(0.054, "USD")).toBe(5)
    expect(getSmallestUnit(0.005104, "USD")).toBe(1)
    expect(getSmallestUnit(0.004104, "USD")).toBe(0)
  })
})
