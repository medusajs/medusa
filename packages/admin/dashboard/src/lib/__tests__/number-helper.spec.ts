import { describe, expect, it } from "vitest"
import { divideDecimal, multiplyDecimal } from "../number-helper"

describe("multiplyDecimal", () => {
  it("avoids the representation error of the native operator", () => {
    expect(3 * 0.1).not.toBe(0.3) // sanity check on the premise
    expect(multiplyDecimal(3, 0.1)).toBe(0.3)
    expect(multiplyDecimal(3, 1.1)).toBe(3.3)
    expect(multiplyDecimal(1.005, 100)).toBe(100.5)
  })

  it("multiplies common fractions exactly", () => {
    expect(multiplyDecimal(4, 0.25)).toBe(1)
    expect(multiplyDecimal(3, 0.5)).toBe(1.5)
    expect(multiplyDecimal(8, 0.125)).toBe(1)
  })

  it("preserves operands smaller than a fixed rounding cap would keep", () => {
    expect(multiplyDecimal(3, 1e-7)).toBe(3e-7)
    expect(multiplyDecimal(0.00001, 0.00001)).toBe(1e-10)
  })

  it("is a no-op for a factor of one", () => {
    expect(multiplyDecimal(42, 1)).toBe(42)
  })

  it("handles zero and negative operands", () => {
    expect(multiplyDecimal(0, 0.25)).toBe(0)
    expect(multiplyDecimal(-3, 0.1)).toBe(-0.3)
  })
})

describe("divideDecimal", () => {
  it("avoids losing a whole unit when the caller floors the result", () => {
    expect(Math.floor(7 / 0.07)).toBe(99) // sanity check on the premise
    expect(Math.floor(divideDecimal(7, 0.07))).toBe(100)
    expect(Math.floor(divideDecimal(14, 0.28))).toBe(50)
    expect(Math.floor(divideDecimal(0.3, 0.1))).toBe(3)
  })

  it("divides by common fractions exactly", () => {
    expect(divideDecimal(98.25, 0.25)).toBe(393)
    expect(divideDecimal(1, 0.125)).toBe(8)
  })

  it("leaves genuinely fractional results intact", () => {
    expect(Math.floor(divideDecimal(10, 3))).toBe(3)
    expect(Math.floor(divideDecimal(7, 2))).toBe(3)
  })

  it("is a no-op for a divisor of one", () => {
    expect(divideDecimal(42, 1)).toBe(42)
  })

  it("propagates division by zero as the native operator does", () => {
    expect(divideDecimal(1, 0)).toBe(Infinity)
  })
})
