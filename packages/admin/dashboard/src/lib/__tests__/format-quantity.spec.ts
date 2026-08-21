import { describe, expect, it } from "vitest"
import { formatQuantity } from "../format-quantity"

describe("formatQuantity", () => {
  it("renders whole quantities without decimals", () => {
    expect(formatQuantity(100)).toBe("100")
  })

  it("renders fractional quantities", () => {
    expect(formatQuantity(98.25)).toBe("98.25")
  })

  it("appends the unit of measure when set", () => {
    expect(formatQuantity(98.25, "lb")).toBe("98.25 lb")
    expect(formatQuantity(0.25, "lb")).toBe("0.25 lb")
  })

  it("hides float artifacts from quantity arithmetic", () => {
    // stocked_quantity - reserved_quantity
    expect(formatQuantity(0.3 - 0.1, "lb")).toBe("0.2 lb")
  })

  it("falls back to a placeholder for missing quantities", () => {
    expect(formatQuantity(undefined)).toBe("-")
    expect(formatQuantity(null, "lb")).toBe("-")
    expect(formatQuantity(NaN)).toBe("-")
  })

  it("renders zero rather than the placeholder", () => {
    expect(formatQuantity(0, "lb")).toBe("0 lb")
  })
})
