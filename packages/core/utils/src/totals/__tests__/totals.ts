import { decorateCartTotals } from "../../totals"

describe("Total calculation", function () {
  it("should calculate carts with items + taxes", function () {
    const cart = {
      items: [
        {
          unit_price: 30,
          quantity: 2,
          tax_lines: [
            {
              rate: 10,
            },
          ],
        },
        {
          unit_price: 5,
          quantity: 1,
          tax_lines: [
            {
              rate: 50,
            },
          ],
        },
      ],
    }

    const serialized = JSON.parse(JSON.stringify(decorateCartTotals(cart)))
    expect(serialized).toEqual({
      items: [
        {
          unit_price: 30,
          quantity: 2,
          tax_lines: [
            {
              rate: 10,
              total: 6,
              subtotal: 6,
            },
          ],
          subtotal: 60,
          total: 66,
          original_total: 66,
          original_subtotal: 60,
          discount_total: 0,
          discount_subtotal: 0,
          discount_tax_total: 0,
          tax_total: 6,
          original_tax_total: 6,
        },
        {
          unit_price: 5,
          quantity: 1,
          tax_lines: [
            {
              rate: 50,
              total: 2.5,
              subtotal: 2.5,
            },
          ],
          subtotal: 5,
          total: 7.5,
          original_total: 7.5,
          original_subtotal: 5,
          discount_total: 0,
          discount_subtotal: 0,
          discount_tax_total: 0,
          tax_total: 2.5,
          original_tax_total: 2.5,
        },
      ],
      total: 73.5,
      subtotal: 65,
      tax_total: 8.5,
      discount_total: 0,
      discount_subtotal: 0,
      discount_tax_total: 0,
      item_total: 73.5,
      item_subtotal: 65,
      item_tax_total: 8.5,
      item_discount_total: 0,
      original_total: 73.5,
      original_subtotal: 65,
      original_tax_total: 8.5,
      original_item_subtotal: 65,
      original_item_total: 73.5,
      original_item_tax_total: 8.5,
      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
    })
  })

  it("should calculate carts with items + taxes + adjustments", function () {
    const cart = {
      items: [
        {
          unit_price: 50,
          quantity: 2,
          tax_lines: [
            {
              rate: 10,
            },
          ],
          adjustments: [
            {
              amount: 10,
            },
          ],
        },
      ],
    }

    const serialized = JSON.parse(JSON.stringify(decorateCartTotals(cart)))

    expect(serialized).toEqual({
      items: [
        {
          unit_price: 50,
          quantity: 2,
          tax_lines: [
            {
              rate: 10,
              total: 9,
              subtotal: 10,
            },
          ],
          adjustments: [
            {
              amount: 10,
              subtotal: 10,
              total: 11,
            },
          ],
          subtotal: 100,
          total: 99,
          original_total: 110,
          original_subtotal: 100,
          discount_total: 11,
          discount_subtotal: 10,
          discount_tax_total: 1,
          tax_total: 9,
          original_tax_total: 10,
        },
      ],
      total: 99,
      subtotal: 100,
      tax_total: 9,
      discount_total: 11,
      discount_subtotal: 10,
      discount_tax_total: 1,
      original_total: 110,
      original_subtotal: 100,
      original_tax_total: 10,
      item_total: 99,
      item_subtotal: 100,
      item_tax_total: 9,
      item_discount_total: 11,
      original_item_total: 110,
      original_item_subtotal: 100,
      original_item_tax_total: 10,
      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
    })
  })

  it("should calculate carts with shipping_methods + items + taxes + discounts with is_tax_inclusive", function () {
    const cartMixed = {
      items: [
        {
          unit_price: 99,
          quantity: 1,
          is_tax_inclusive: true,
          tax_lines: [
            {
              rate: 10,
            },
          ],
          adjustments: [
            {
              amount: 9,
            },
          ],
        },
        {
          unit_price: 9,
          quantity: 1,
          is_tax_inclusive: false,
          tax_lines: [
            {
              rate: 10,
            },
          ],
          adjustments: [
            {
              amount: 3,
            },
          ],
        },
      ],
      shipping_methods: [
        {
          amount: 99,
          is_tax_inclusive: true,
          tax_lines: [
            {
              rate: 10,
            },
          ],
          adjustments: [
            {
              amount: 9,
            },
          ],
        },
        {
          amount: 9,
          is_tax_inclusive: false,
          tax_lines: [
            {
              rate: 10,
            },
          ],
          adjustments: [
            {
              amount: 3,
            },
          ],
        },
      ],
    }

    const serializedMixed = JSON.parse(
      JSON.stringify(decorateCartTotals(cartMixed))
    )

    expect(serializedMixed).toEqual({
      items: [
        {
          unit_price: 99,
          quantity: 1,
          is_tax_inclusive: true,
          tax_lines: [
            {
              rate: 10,
              subtotal: 9,
              total: 8.1,
            },
          ],
          adjustments: [
            {
              amount: 9,
              subtotal: 9,
              total: 9.9,
            },
          ],
          subtotal: 90,
          total: 89.1,
          original_total: 99,
          original_subtotal: 90,
          discount_total: 9.9,
          discount_subtotal: 9,
          discount_tax_total: 0.9,
          tax_total: 8.1,
          original_tax_total: 9,
        },
        {
          unit_price: 9,
          quantity: 1,
          is_tax_inclusive: false,
          tax_lines: [
            {
              rate: 10,
              total: 0.6,
              subtotal: 0.9,
            },
          ],
          adjustments: [
            {
              amount: 3,
              subtotal: 3,
              total: 3.3,
            },
          ],
          subtotal: 9,
          total: 6.6,
          original_total: 9.9,
          original_subtotal: 9,
          discount_total: 3.3,
          discount_subtotal: 3,
          discount_tax_total: 0.3,
          tax_total: 0.6,
          original_tax_total: 0.9,
        },
      ],
      shipping_methods: [
        {
          is_tax_inclusive: true,
          tax_lines: [
            {
              rate: 10,
              subtotal: 9,
              total: 8.1,
            },
          ],
          adjustments: [
            {
              amount: 9,
              subtotal: 9,
              total: 9.9,
            },
          ],
          amount: 99,
          subtotal: 90,
          total: 89.1,
          original_total: 99,
          original_subtotal: 90,
          discount_total: 9.9,
          discount_subtotal: 9,
          discount_tax_total: 0.9,
          tax_total: 8.1,
          original_tax_total: 9,
        },
        {
          amount: 9,
          is_tax_inclusive: false,
          tax_lines: [
            {
              rate: 10,
              total: 0.6,
              subtotal: 0.9,
            },
          ],
          adjustments: [
            {
              amount: 3,
              subtotal: 3,
              total: 3.3,
            },
          ],
          subtotal: 9,
          total: 6.6,
          original_total: 9.9,
          original_subtotal: 9,
          discount_total: 3.3,
          discount_subtotal: 3,
          discount_tax_total: 0.3,
          tax_total: 0.6,
          original_tax_total: 0.9,
        },
      ],
      total: 191.4,
      subtotal: 198,
      tax_total: 17.4,
      discount_total: 26.4,
      discount_subtotal: 24,
      discount_tax_total: 2.4,
      original_total: 217.8,
      original_subtotal: 198,
      original_tax_total: 19.8,
      item_total: 95.7,
      item_subtotal: 99,
      item_tax_total: 8.7,
      item_discount_total: 13.2,
      original_item_total: 108.9,
      original_item_subtotal: 99,
      original_item_tax_total: 9.9,
      shipping_total: 95.7,
      shipping_subtotal: 99,
      shipping_tax_total: 8.7,
      shipping_discount_total: 13.2,
      original_shipping_tax_total: 9.9,
      original_shipping_subtotal: 99,
      original_shipping_total: 108.9,
      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
    })
  })

  it("should calculate carts with items + taxes with is_tax_inclusive", function () {
    const cartWithTax = {
      items: [
        {
          unit_price: 50,
          quantity: 2,
          is_tax_inclusive: true,
          tax_lines: [
            {
              rate: 10,
            },
          ],
        },
      ],
    }

    const cartWithoutTax = {
      items: [
        {
          unit_price: 50,
          quantity: 2,
          is_tax_inclusive: false,
          tax_lines: [
            {
              rate: 10,
            },
          ],
        },
      ],
    }

    const cartMixed = {
      items: [...cartWithTax.items, ...cartWithoutTax.items],
    }

    const serializedWith = JSON.parse(
      JSON.stringify(decorateCartTotals(cartWithTax))
    )
    const serializedWithout = JSON.parse(
      JSON.stringify(decorateCartTotals(cartWithoutTax))
    )
    const serializedMixed = JSON.parse(
      JSON.stringify(decorateCartTotals(cartMixed))
    )

    expect(serializedWith).toEqual({
      items: [
        {
          discount_subtotal: 0,
          unit_price: 50,
          quantity: 2,
          is_tax_inclusive: true,
          tax_lines: [
            {
              rate: 10,
              total: 9.090909090909092,
              subtotal: 9.090909090909092,
            },
          ],
          subtotal: 90.9090909090909,
          total: 100,
          original_total: 100,
          original_subtotal: 90.9090909090909,
          discount_total: 0,
          discount_tax_total: 0,
          tax_total: 9.090909090909092,
          original_tax_total: 9.090909090909092,
        },
      ],
      discount_subtotal: 0,
      total: 100,
      subtotal: 90.9090909090909,
      tax_total: 9.090909090909092,
      discount_total: 0,
      discount_tax_total: 0,
      original_total: 100,
      original_subtotal: 90.9090909090909,
      original_tax_total: 9.090909090909092,
      item_total: 100,
      item_subtotal: 90.9090909090909,
      item_tax_total: 9.090909090909092,
      item_discount_total: 0,
      original_item_total: 100,
      original_item_subtotal: 90.9090909090909,
      original_item_tax_total: 9.090909090909092,
      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
    })

    expect(serializedWithout).toEqual({
      items: [
        {
          discount_subtotal: 0,
          unit_price: 50,
          quantity: 2,
          is_tax_inclusive: false,
          tax_lines: [
            {
              rate: 10,
              total: 10,
              subtotal: 10,
            },
          ],
          subtotal: 100,
          total: 110,
          original_total: 110,
          discount_total: 0,
          discount_tax_total: 0,
          tax_total: 10,
          original_tax_total: 10,
          original_subtotal: 100,
        },
      ],
      total: 110,
      discount_subtotal: 0,
      subtotal: 100,
      tax_total: 10,
      discount_total: 0,
      discount_tax_total: 0,
      original_total: 110,
      original_subtotal: 100,
      original_tax_total: 10,
      item_total: 110,
      item_subtotal: 100,
      item_tax_total: 10,
      item_discount_total: 0,
      original_item_total: 110,
      original_item_subtotal: 100,
      original_item_tax_total: 10,
      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
    })

    expect(serializedMixed).toEqual({
      items: [
        {
          discount_subtotal: 0,
          unit_price: 50,
          quantity: 2,
          is_tax_inclusive: true,
          tax_lines: [
            {
              rate: 10,
              total: 9.090909090909092,
              subtotal: 9.090909090909092,
            },
          ],
          subtotal: 90.9090909090909,
          total: 100,
          original_subtotal: 90.9090909090909,
          original_total: 100,
          discount_total: 0,
          discount_tax_total: 0,
          tax_total: 9.090909090909092,
          original_tax_total: 9.090909090909092,
        },
        {
          discount_subtotal: 0,
          unit_price: 50,
          quantity: 2,
          is_tax_inclusive: false,
          tax_lines: [
            {
              rate: 10,
              total: 10,
              subtotal: 10,
            },
          ],
          subtotal: 100,
          total: 110,
          original_total: 110,
          original_subtotal: 100,
          discount_total: 0,
          discount_tax_total: 0,
          tax_total: 10,
          original_tax_total: 10,
        },
      ],
      discount_subtotal: 0,
      total: 210,
      subtotal: 190.9090909090909,
      tax_total: 19.09090909090909,
      discount_total: 0,
      discount_tax_total: 0,
      original_total: 210,
      original_subtotal: 190.9090909090909,
      original_tax_total: 19.09090909090909,
      item_total: 210,
      item_subtotal: 190.9090909090909,
      item_tax_total: 19.09090909090909,
      item_discount_total: 0,
      original_item_total: 210,
      original_item_subtotal: 190.9090909090909,
      original_item_tax_total: 19.09090909090909,
      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
    })
  })

  it("should calculate tax inclusive carts with items + taxes with tax inclusive adjustments", function () {
    /**
     * TAX INCLUSIVE CART
     *
     * Total price -> 120 tax inclusive
     * Fixed discount -> 10 tax inclusive total (which results in a subtotal of 8.33 of the discount)
     * Tax rate -> 20%
     */

    const cart = {
      items: [
        {
          unit_price: 60,
          quantity: 2,
          is_tax_inclusive: true,
          adjustments: [
            {
              amount: 8.333333333333334,
            },
          ],
          tax_lines: [
            {
              rate: 20,
            },
          ],
        },
      ],
    }

    const serialized = JSON.parse(JSON.stringify(decorateCartTotals(cart)))

    expect(serialized).toEqual({
      items: [
        {
          unit_price: 60,
          quantity: 2,
          subtotal: 100,
          tax_total: 18.333333333333332,
          total: 110,
          is_tax_inclusive: true,

          original_total: 120,
          original_subtotal: 100,
          original_tax_total: 20,

          discount_subtotal: 8.333333333333334,
          discount_tax_total: 1.6666666666666667,
          discount_total: 10,

          tax_lines: [
            {
              rate: 20,
              total: 18.333333333333332,
              subtotal: 20,
            },
          ],
          adjustments: [
            {
              amount: 8.333333333333334,
              subtotal: 8.333333333333334,
              total: 10,
            },
          ],
        },
      ],
      subtotal: 100,
      tax_total: 18.333333333333332,
      total: 110,

      original_item_subtotal: 100,
      original_item_tax_total: 20,
      original_item_total: 120,
      original_tax_total: 20,
      original_total: 120,
      original_subtotal: 100,

      discount_subtotal: 8.333333333333334,
      discount_tax_total: 1.6666666666666667,
      discount_total: 10,

      item_subtotal: 100,
      item_tax_total: 18.333333333333332,
      item_total: 110,
      item_discount_total: 10,

      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
    })
  })

  it("should calculate carts with items + taxes + adjustments + shipping methods", function () {
    const cart = {
      items: [
        {
          unit_price: 50,
          quantity: 2,
          tax_lines: [
            {
              rate: 10,
            },
          ],
          adjustments: [
            {
              amount: 20,
            },
          ],
        },
      ],
      shipping_methods: [
        {
          amount: 25,
          tax_lines: [
            {
              rate: 10,
            },
          ],
          adjustments: [
            {
              amount: 2,
            },
          ],
        },
      ],
    }

    const serialized = JSON.parse(JSON.stringify(decorateCartTotals(cart)))

    expect(serialized).toEqual({
      items: [
        {
          unit_price: 50,
          quantity: 2,
          tax_lines: [
            {
              rate: 10,
              total: 8,
              subtotal: 10,
            },
          ],
          adjustments: [
            {
              amount: 20,
              subtotal: 20,
              total: 22,
            },
          ],
          subtotal: 100,
          total: 88,
          original_total: 110,
          original_subtotal: 100,
          discount_total: 22,
          discount_subtotal: 20,
          discount_tax_total: 2,
          tax_total: 8,
          original_tax_total: 10,
        },
      ],
      shipping_methods: [
        {
          amount: 25,
          tax_lines: [
            {
              rate: 10,
              total: 2.3,
              subtotal: 2.5,
            },
          ],
          adjustments: [
            {
              amount: 2,
              subtotal: 2,
              total: 2.2,
            },
          ],
          subtotal: 25,
          total: 25.3,
          original_total: 27.5,
          original_subtotal: 25,
          discount_total: 2.2,
          discount_subtotal: 2,
          discount_tax_total: 0.2,
          tax_total: 2.3,
          original_tax_total: 2.5,
        },
      ],
      total: 113.3,
      subtotal: 125,
      tax_total: 10.3,
      discount_total: 24.2,
      discount_subtotal: 22,
      discount_tax_total: 2.2,
      original_total: 137.5,
      original_subtotal: 125,
      original_tax_total: 12.5,
      item_total: 88,
      item_subtotal: 100,
      item_tax_total: 8,
      item_discount_total: 22,
      original_item_total: 110,
      original_item_subtotal: 100,
      original_item_tax_total: 10,
      shipping_total: 25.3,
      shipping_subtotal: 25,
      shipping_tax_total: 2.3,
      shipping_discount_total: 2.2,
      original_shipping_tax_total: 2.5,
      original_shipping_subtotal: 25,
      original_shipping_total: 27.5,
      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
    })
  })

  it("should calculate order with items + taxes + adjustments + credit lines", function () {
    const cart = {
      credit_lines: [
        {
          amount: 40,
          reference: "order",
          reference_id: "order_123",
        },
      ],
      items: [
        {
          unit_price: 50,
          quantity: 2,
          detail: {
            fulfilled_quantity: 2,
            shipped_quantity: 2,
            return_requested_quantity: 0,
            return_received_quantity: 1,
            return_dismissed_quantity: 1,
            written_off_quantity: 1,
          },
          tax_lines: [
            {
              rate: 10,
            },
          ],
          adjustments: [
            {
              amount: 20,
            },
          ],
        },
      ],
    }

    const serialized = JSON.parse(JSON.stringify(decorateCartTotals(cart)))

    expect(serialized).toEqual({
      credit_lines: [
        {
          amount: 40,
          reference: "order",
          reference_id: "order_123",
          subtotal: 40,
          total: 40,
        },
      ],
      items: [
        {
          unit_price: 50,
          quantity: 2,
          detail: {
            fulfilled_quantity: 2,
            shipped_quantity: 2,
            return_requested_quantity: 0,
            return_received_quantity: 1,
            return_dismissed_quantity: 1,
            written_off_quantity: 1,
          },
          tax_lines: [
            {
              rate: 10,
              total: 0,
              subtotal: 0,
            },
          ],
          adjustments: [
            {
              amount: 20,
              subtotal: 20,
              total: 22,
            },
          ],
          subtotal: 0,
          total: 0,
          original_total: 0,
          original_subtotal: 0,
          discount_total: 0,
          discount_subtotal: 0,
          discount_tax_total: 0,
          tax_total: 0,
          original_tax_total: 0,
          refundable_total_per_unit: 0,
          refundable_total: 0,
          fulfilled_total: 88,
          shipped_total: 88,
          return_requested_total: 0,
          return_received_total: 44,
          return_dismissed_total: 44,
          write_off_total: 44,
        },
      ],
      total: -40,
      subtotal: 0,
      tax_total: 0,
      discount_total: 0,
      discount_subtotal: 0,
      discount_tax_total: 0,
      original_total: 0,
      original_subtotal: 0,
      original_tax_total: 0,
      item_total: 0,
      item_subtotal: 0,
      item_tax_total: 0,
      item_discount_total: 0,
      original_item_total: 0,
      original_item_subtotal: 0,
      original_item_tax_total: 0,
      fulfilled_total: 88,
      shipped_total: 88,
      return_requested_total: 0,
      return_received_total: 44,
      return_dismissed_total: 44,
      write_off_total: 44,
      credit_line_subtotal: 40,
      credit_line_tax_total: 0,
      credit_line_total: 40,
    })
  })

  it("should calculate carts with items + taxes + adjustments", function () {
    const cart = {
      items: [
        {
          unit_price: 119,
          quantity: 1,
          tax_lines: [
            {
              rate: 19,
            },
          ],
          adjustments: [
            {
              amount: 119,
            },
          ],
        },
      ],
    }

    const serialized = JSON.parse(JSON.stringify(decorateCartTotals(cart)))

    expect(serialized).toEqual({
      items: [
        {
          unit_price: 119,
          quantity: 1,
          tax_lines: [
            {
              rate: 19,
              subtotal: 22.61,
              total: 0,
            },
          ],
          adjustments: [
            {
              amount: 119,
              subtotal: 119,
              total: 141.61,
            },
          ],
          subtotal: 119,
          total: 0,
          original_total: 141.61,
          original_subtotal: 119,
          discount_total: 141.61,
          discount_subtotal: 119,
          discount_tax_total: 22.61,
          tax_total: 0,
          original_tax_total: 22.61,
        },
      ],
      total: 0,
      subtotal: 119,
      tax_total: 0,
      discount_total: 141.61,
      discount_subtotal: 119,
      discount_tax_total: 22.61,
      original_total: 141.61,
      original_subtotal: 119,
      original_tax_total: 22.61,
      item_total: 0,
      item_subtotal: 119,
      item_tax_total: 0,
      item_discount_total: 141.61,
      original_item_total: 141.61,
      original_item_subtotal: 119,
      original_item_tax_total: 22.61,
      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
    })
  })

  it("should calculate carts with items + taxes with is_tax_inclusive", function () {
    const cartWithTax = {
      items: [
        {
          unit_price: 119,
          quantity: 1,
          is_tax_inclusive: true,
          tax_lines: [
            {
              rate: 19,
            },
          ],
        },
      ],
    }

    const cartWithoutTax = {
      items: [
        {
          unit_price: 119,
          quantity: 1,
          is_tax_inclusive: false,
          tax_lines: [
            {
              rate: 19,
            },
          ],
        },
      ],
    }

    const cartMixed = {
      items: [...cartWithTax.items, ...cartWithoutTax.items],
    }

    const serializedWith = JSON.parse(
      JSON.stringify(decorateCartTotals(cartWithTax))
    )
    const serializedWithout = JSON.parse(
      JSON.stringify(decorateCartTotals(cartWithoutTax))
    )
    const serializedMixed = JSON.parse(
      JSON.stringify(decorateCartTotals(cartMixed))
    )

    expect(serializedWith).toEqual({
      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
      discount_subtotal: 0,
      discount_tax_total: 0,
      discount_total: 0,
      item_subtotal: 100,
      item_tax_total: 19,
      item_discount_total: 0,
      item_total: 119,
      items: [
        {
          discount_subtotal: 0,
          discount_tax_total: 0,
          discount_total: 0,
          is_tax_inclusive: true,
          original_tax_total: 19,
          original_subtotal: 100,
          original_total: 119,
          quantity: 1,
          subtotal: 100,
          tax_lines: [
            {
              rate: 19,
              subtotal: 19,
              total: 19,
            },
          ],
          tax_total: 19,
          total: 119,
          unit_price: 119,
        },
      ],
      original_item_subtotal: 100,
      original_item_tax_total: 19,
      original_item_total: 119,
      original_tax_total: 19,
      original_subtotal: 100,
      original_total: 119,
      subtotal: 100,
      tax_total: 19,
      total: 119,
    })

    expect(serializedWithout).toEqual({
      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
      discount_subtotal: 0,
      discount_tax_total: 0,
      discount_total: 0,
      item_subtotal: 119,
      item_tax_total: 22.61,
      item_total: 141.61,
      item_discount_total: 0,
      items: [
        {
          discount_subtotal: 0,
          discount_tax_total: 0,
          discount_total: 0,
          is_tax_inclusive: false,
          original_tax_total: 22.61,
          original_subtotal: 119,
          original_total: 141.61,
          quantity: 1,
          subtotal: 119,
          tax_lines: [
            {
              rate: 19,
              subtotal: 22.61,
              total: 22.61,
            },
          ],
          tax_total: 22.61,
          total: 141.61,
          unit_price: 119,
        },
      ],
      original_item_subtotal: 119,
      original_item_tax_total: 22.61,
      original_item_total: 141.61,
      original_tax_total: 22.61,
      original_subtotal: 119,
      original_total: 141.61,
      subtotal: 119,
      tax_total: 22.61,
      total: 141.61,
    })

    expect(serializedMixed).toEqual({
      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
      discount_subtotal: 0,
      discount_tax_total: 0,
      discount_total: 0,
      item_subtotal: 219,
      item_tax_total: 41.61,
      item_total: 260.61,
      item_discount_total: 0,
      items: [
        {
          discount_subtotal: 0,
          discount_tax_total: 0,
          discount_total: 0,
          is_tax_inclusive: true,
          original_tax_total: 19,
          original_total: 119,
          original_subtotal: 100,
          quantity: 1,
          subtotal: 100,
          tax_lines: [
            {
              rate: 19,
              subtotal: 19,
              total: 19,
            },
          ],
          tax_total: 19,
          total: 119,
          unit_price: 119,
        },
        {
          discount_subtotal: 0,
          discount_tax_total: 0,
          discount_total: 0,
          is_tax_inclusive: false,
          original_tax_total: 22.61,
          original_subtotal: 119,
          original_total: 141.61,
          quantity: 1,
          subtotal: 119,
          tax_lines: [
            {
              rate: 19,
              subtotal: 22.61,
              total: 22.61,
            },
          ],
          tax_total: 22.61,
          total: 141.61,
          unit_price: 119,
        },
      ],
      original_item_subtotal: 219,
      original_item_tax_total: 41.61,
      original_item_total: 260.61,
      original_subtotal: 219,
      original_tax_total: 41.61,
      original_total: 260.61,
      subtotal: 219,
      tax_total: 41.61,
      total: 260.61,
    })
  })

  it("should calculate tax inclusive carts with items + taxes with tax inclusive adjustments", function () {
    const cart = {
      items: [
        {
          unit_price: 119,
          quantity: 1,
          is_tax_inclusive: true,
          adjustments: [
            {
              amount: 100,
            },
          ],
          tax_lines: [
            {
              rate: 19,
            },
          ],
        },
      ],
    }

    const serialized = JSON.parse(JSON.stringify(decorateCartTotals(cart)))

    expect(serialized).toEqual({
      credit_line_subtotal: 0,
      credit_line_tax_total: 0,
      credit_line_total: 0,
      discount_subtotal: 100,
      discount_tax_total: 19,
      discount_total: 119,
      item_subtotal: 100,
      item_tax_total: 0,
      item_total: 0,
      item_discount_total: 119,
      items: [
        {
          adjustments: [
            {
              amount: 100,
              subtotal: 100,
              total: 119,
            },
          ],
          discount_subtotal: 100,
          discount_tax_total: 19,
          discount_total: 119,
          is_tax_inclusive: true,
          original_tax_total: 19,
          original_subtotal: 100,
          original_total: 119,
          quantity: 1,
          subtotal: 100,
          tax_lines: [
            {
              rate: 19,
              subtotal: 19,
              total: 0,
            },
          ],
          tax_total: 0,
          total: 0,
          unit_price: 119,
        },
      ],
      original_item_subtotal: 100,
      original_item_tax_total: 19,
      original_item_total: 119,
      original_tax_total: 19,
      original_subtotal: 100,
      original_total: 119,
      subtotal: 100,
      tax_total: 0,
      total: 0,
    })
  })

  it("should calculate refundable_total for tax inclusive items without inflating tax", function () {
    const cartTaxInclusive = {
      items: [
        {
          unit_price: 100,
          quantity: 2,
          is_tax_inclusive: true,
          detail: {
            fulfilled_quantity: 2,
            shipped_quantity: 2,
            return_requested_quantity: 0,
            return_received_quantity: 0,
            return_dismissed_quantity: 0,
            written_off_quantity: 0,
          },
          tax_lines: [
            {
              rate: 20,
            },
          ],
          adjustments: [
            {
              amount: 10,
            },
          ],
        },
      ],
    }

    const serializedTaxInclusive = JSON.parse(
      JSON.stringify(decorateCartTotals(cartTaxInclusive))
    )

    expect(serializedTaxInclusive.items[0].refundable_total).toBe(188)
    expect(serializedTaxInclusive.items[0].refundable_total_per_unit).toBe(94)
  })
})
