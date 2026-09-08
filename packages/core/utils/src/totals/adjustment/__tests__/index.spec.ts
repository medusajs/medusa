import { calculateAdjustmentTotal } from "../index"

describe("calculateAdjustmentTotal", function () {
  it("assigns each adjustment its own subtotal/total, not the running cumulative sum", function () {
    const adjustments: any[] = [{ amount: 10 }, { amount: 20 }, { amount: 5 }]

    const result = calculateAdjustmentTotal({ adjustments })

    // Per-adjustment fields must reflect each adjustment individually.
    expect(Number(adjustments[0].subtotal)).toEqual(10)
    expect(Number(adjustments[0].total)).toEqual(10)
    // Regression: these were 30 and 35 (cumulative) before the fix.
    expect(Number(adjustments[1].subtotal)).toEqual(20)
    expect(Number(adjustments[1].total)).toEqual(20)
    expect(Number(adjustments[2].subtotal)).toEqual(5)
    expect(Number(adjustments[2].total)).toEqual(5)

    // Aggregate return values remain the sum across all adjustments.
    expect(Number(result.adjustmentsSubtotal)).toEqual(35)
    expect(Number(result.adjustmentsTotal)).toEqual(35)
  })

  it("applies tax per adjustment when a taxRate is provided", function () {
    const adjustments: any[] = [
      { amount: 100, is_tax_inclusive: false },
      { amount: 200, is_tax_inclusive: false },
    ]

    calculateAdjustmentTotal({ adjustments, taxRate: 0.1 })

    // subtotal is the tax-exclusive amount; total includes 10% tax — per adjustment.
    expect(Number(adjustments[0].subtotal)).toEqual(100)
    expect(Number(adjustments[0].total)).toEqual(110)
    expect(Number(adjustments[1].subtotal)).toEqual(200)
    expect(Number(adjustments[1].total)).toEqual(220)
  })
})
