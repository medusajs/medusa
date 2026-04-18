import { decorateCartTotals } from "@medusajs/framework/utils"
import { VirtualOrder } from "@types"
import { calculateOrderChange } from "../../../../utils"

describe("calculateOrderChange - getSummary with cost breakdown (issue #15125)", function () {
  const baseOrder: VirtualOrder = {
    id: "order_1",
    items: [
      {
        id: "item_1",
        quantity: 2,
        unit_price: 500,
        compare_at_unit_price: null,
        order_id: "order_1",
        tax_lines: [{ rate: 10, name: "VAT", code: "VAT" }],
        adjustments: [],
        detail: {
          quantity: 2,
          order_id: "order_1",
          delivered_quantity: 0,
          shipped_quantity: 0,
          fulfilled_quantity: 0,
          return_requested_quantity: 0,
          return_received_quantity: 0,
          return_dismissed_quantity: 0,
          written_off_quantity: 0,
        },
      },
    ],
    shipping_methods: [
      {
        id: "shipping_1",
        amount: 100,
        order_id: "order_1",
        tax_lines: [{ rate: 10, name: "VAT", code: "VAT" }],
        adjustments: [],
      },
    ],
    credit_lines: [],
    total: 1210,
  }

  it("getSummary should include shipping_total, tax_total, and subtotal when a decorated order is passed", function () {
    // decorateCartTotals computes shipping_total, tax_total, subtotal, etc.
    const decoratedOrder = decorateCartTotals(baseOrder) as any

    const calculated = calculateOrderChange({
      order: decoratedOrder,
      actions: [],
      transactions: [],
    })

    // Pass the decorated order into getSummary so it picks up the breakdown fields
    const summary = JSON.parse(
      JSON.stringify(calculated.getSummary(decoratedOrder))
    )

    // Accounting fields should still be correct
    expect(summary.current_order_total).toBeGreaterThan(0)
    expect(summary.original_order_total).toBeGreaterThan(0)

    // Breakdown fields must now be present and non-zero (this is the fix for #15125)
    expect(summary.shipping_total).toBeGreaterThan(0)
    expect(summary.tax_total).toBeGreaterThan(0)
    expect(summary.subtotal).toBeGreaterThan(0)
    expect(summary.original_shipping_total).toBeGreaterThan(0)
    expect(summary.original_tax_total).toBeGreaterThan(0)

    // Discount should be 0 since we have no adjustments
    expect(summary.discount_total).toEqual(0)
  })

  it("getSummary without a decorated order falls back to this.order values gracefully", function () {
    const calculated = calculateOrderChange({
      order: baseOrder, // not decorated — but order has raw amount values
      actions: [],
      transactions: [],
    })

    // Called without a decorated order — fields should still exist and not crash
    // They fall back to this.order raw values (shipping_method amount = 100 + its tax)
    const summary = JSON.parse(JSON.stringify(calculated.getSummary()))

    expect(summary.shipping_total).toBeDefined()
    expect(summary.tax_total).toBeDefined()
    expect(summary.subtotal).toBeDefined()

    // Critically — these keys must exist in the object (no undefined/missing)
    expect(Object.keys(summary)).toContain("shipping_total")
    expect(Object.keys(summary)).toContain("tax_total")
    expect(Object.keys(summary)).toContain("subtotal")
    expect(Object.keys(summary)).toContain("discount_total")
  })
})
