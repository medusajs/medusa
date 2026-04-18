import { decorateCartTotals } from "@medusajs/framework/utils"
import { VirtualOrder } from "@types"
import { calculateOrderChange } from "../../../../utils"

describe("calculateOrderChange - getSummary with cost breakdown", function () {
  const baseOrder: VirtualOrder = {
    id: "order_1",
    items: [
      {
        id: "item_1",
        quantity: 2,
        unit_price: 500,
        compare_at_unit_price: null,
        order_id: "order_1",
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
        adjustments: [],
      },
    ],
    credit_lines: [],
    total: 1100,
  }

  it("getSummary should include shipping_total and subtotal when a decorated order is passed", function () {
    const decoratedOrder = decorateCartTotals(baseOrder) as any

    const calculated = calculateOrderChange({
      order: decoratedOrder,
      actions: [],
      transactions: [],
    })

    const summary = JSON.parse(
      JSON.stringify(calculated.getSummary(decoratedOrder))
    )

    expect(summary.current_order_total).toBeGreaterThan(0)
    expect(summary.original_order_total).toBeGreaterThan(0)

    expect(summary.shipping_total).toBeGreaterThan(0)
    expect(summary.subtotal).toBeGreaterThan(0)
    expect(summary.original_shipping_total).toBeGreaterThan(0)
  })

  it("getSummary without a decorated order still contains all breakdown keys", function () {
    const calculated = calculateOrderChange({
      order: baseOrder,
      actions: [],
      transactions: [],
    })

    const summary = JSON.parse(JSON.stringify(calculated.getSummary()))

    expect(Object.keys(summary)).toContain("shipping_total")
    expect(Object.keys(summary)).toContain("tax_total")
    expect(Object.keys(summary)).toContain("subtotal")
    expect(Object.keys(summary)).toContain("discount_total")
    expect(Object.keys(summary)).toContain("original_shipping_total")
    expect(Object.keys(summary)).toContain("original_tax_total")
  })
})
