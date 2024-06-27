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
          discount_total: 0,
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
          discount_total: 0,
          discount_tax_total: 0,
          tax_total: 2.5,
          original_tax_total: 2.5,
        },
      ],
      total: 73.5,
      subtotal: 65,
      tax_total: 8.5,
      discount_total: 0,
      discount_tax_total: 0,
      item_total: 73.5,
      item_subtotal: 65,
      item_tax_total: 8.5,
      original_total: 73.5,
      original_tax_total: 8.5,
      original_item_subtotal: 65,
      original_item_total: 73.5,
      original_item_tax_total: 8.5,
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
              total: 11,
              subtotal: 10,
            },
          ],
          subtotal: 100,
          total: 99,
          original_total: 110,
          discount_total: 10,
          discount_tax_total: 1,
          tax_total: 9,
          original_tax_total: 10,
        },
      ],
      total: 99,
      subtotal: 100,
      tax_total: 9,
      discount_total: 10,
      discount_tax_total: 1,
      original_total: 100,
      original_tax_total: 10,
      item_total: 99,
      item_subtotal: 100,
      item_tax_total: 9,
      original_item_total: 110,
      original_item_subtotal: 100,
      original_item_tax_total: 10,
    })
  })

  it("should calculate carts with shipping_methods + items + taxes + discounts with is_tax_inclusive", function () {
    const cartMixed = {
      items: [
        {
          unit_price: 100,
          quantity: 1,
          is_tax_inclusive: true,
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
        {
          unit_price: 10,
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
          amount: 10,
          is_tax_inclusive: true,
          tax_lines: [
            {
              rate: 5,
            },
          ],
          adjustments: [
            {
              amount: 2,
            },
          ],
        },
        {
          amount: 5,
          is_tax_inclusive: false,
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

    const serializedMixed = JSON.parse(
      JSON.stringify(decorateCartTotals(cartMixed))
    )

    expect(serializedMixed).toEqual({
      items: [
        {
          unit_price: 100,
          quantity: 1,
          is_tax_inclusive: true,
          tax_lines: [
            {
              rate: 10,
              total: 8.181818181818182,
              subtotal: 9.090909090909092,
            },
          ],
          adjustments: [
            {
              amount: 10,
              subtotal: 9.090909090909092,
              total: 10,
            },
          ],
          subtotal: 90.9090909090909,
          total: 90,
          original_total: 100,
          discount_total: 10,
          discount_tax_total: 1,
          tax_total: 8.181818181818182,
          original_tax_total: 9.090909090909092,
        },
        {
          unit_price: 10,
          quantity: 1,
          is_tax_inclusive: false,
          tax_lines: [
            {
              rate: 10,
              total: 0.7,
              subtotal: 1,
            },
          ],
          adjustments: [
            {
              amount: 3,
              subtotal: 3,
              total: 3.3,
            },
          ],
          subtotal: 10,
          total: 7.7,
          original_total: 11,
          discount_total: 3,
          discount_tax_total: 0.3,
          tax_total: 0.7,
          original_tax_total: 1,
        },
      ],
      shipping_methods: [
        {
          amount: 10,
          is_tax_inclusive: true,
          tax_lines: [
            {
              rate: 5,
              total: 0.38095238095238093,
              subtotal: 0.47619047619047616,
            },
          ],
          adjustments: [
            {
              amount: 2,
              subtotal: 1.9047619047619047,
              total: 2,
            },
          ],
          subtotal: 10.380952380952381,
          total: 8,
          original_total: 10,
          discount_total: 2,
          discount_tax_total: 0.1,
          tax_total: 0.38095238095238093,
          original_tax_total: 0.47619047619047616,
        },
        {
          amount: 5,
          is_tax_inclusive: false,
          tax_lines: [
            {
              rate: 10,
              total: 0.3,
              subtotal: 0.5,
            },
          ],
          adjustments: [
            {
              amount: 2,
              subtotal: 2,
              total: 2.2,
            },
          ],
          subtotal: 5,
          total: 3.3,
          original_total: 5.5,
          discount_total: 2,
          discount_tax_total: 0.2,
          tax_total: 0.3,
          original_tax_total: 0.5,
        },
      ],
      total: 104.77186147186147,
      subtotal: 100.9090909090909,
      tax_total: 9.562770562770563,
      discount_total: 17,
      discount_tax_total: 1.6,
      original_total: 110.47619047619048,
      original_tax_total: 11.067099567099566,
      item_total: 97.7,
      item_subtotal: 100.9090909090909,
      item_tax_total: 8.881818181818181,
      original_item_total: 111,
      original_item_subtotal: 100.9090909090909,
      original_item_tax_total: 10.090909090909092,
      shipping_total: 11.3,
      shipping_subtotal: 15.380952380952381,
      shipping_tax_total: 0.680952380952381,
      original_shipping_tax_total: 0.9761904761904762,
      original_shipping_tax_subtotal: 15.380952380952381,
      original_shipping_total: 15.5,
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
          discount_total: 0,
          discount_tax_total: 0,
          tax_total: 9.090909090909092,
          original_tax_total: 9.090909090909092,
        },
      ],
      total: 100,
      subtotal: 90.9090909090909,
      tax_total: 9.090909090909092,
      discount_total: 0,
      discount_tax_total: 0,
      original_total: 100,
      original_tax_total: 9.090909090909092,
      item_total: 100,
      item_subtotal: 90.9090909090909,
      item_tax_total: 9.090909090909092,
      original_item_total: 100,
      original_item_subtotal: 90.9090909090909,
      original_item_tax_total: 9.090909090909092,
    })

    expect(serializedWithout).toEqual({
      items: [
        {
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
        },
      ],
      total: 110,
      subtotal: 100,
      tax_total: 10,
      discount_total: 0,
      discount_tax_total: 0,
      original_total: 110,
      original_tax_total: 10,
      item_total: 110,
      item_subtotal: 100,
      item_tax_total: 10,
      original_item_total: 110,
      original_item_subtotal: 100,
      original_item_tax_total: 10,
    })

    expect(serializedMixed).toEqual({
      items: [
        {
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
          discount_total: 0,
          discount_tax_total: 0,
          tax_total: 9.090909090909092,
          original_tax_total: 9.090909090909092,
        },
        {
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
        },
      ],
      total: 210,
      subtotal: 190.9090909090909,
      tax_total: 19.09090909090909,
      discount_total: 0,
      discount_tax_total: 0,
      original_total: 210,
      original_tax_total: 19.09090909090909,
      item_total: 210,
      item_subtotal: 190.9090909090909,
      item_tax_total: 19.09090909090909,
      original_item_total: 210,
      original_item_subtotal: 190.9090909090909,
      original_item_tax_total: 19.09090909090909,
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
              total: 22,
              subtotal: 20,
            },
          ],
          subtotal: 100,
          total: 88,
          original_total: 110,
          discount_total: 20,
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
              total: 2.2,
              subtotal: 2,
            },
          ],
          subtotal: 25,
          total: 25.3,
          original_total: 27.5,
          discount_total: 2,
          discount_tax_total: 0.2,
          tax_total: 2.3,
          original_tax_total: 2.5,
        },
      ],
      total: 113.6,
      subtotal: 100,
      tax_total: 10.3,
      discount_total: 22,
      discount_tax_total: 2.2,
      original_total: 118,
      original_tax_total: 12.5,
      item_total: 88,
      item_subtotal: 100,
      item_tax_total: 8,
      original_item_total: 110,
      original_item_subtotal: 100,
      original_item_tax_total: 10,
      shipping_total: 25.3,
      shipping_subtotal: 25,
      shipping_tax_total: 2.3,
      original_shipping_tax_total: 2.5,
      original_shipping_tax_subtotal: 25,
      original_shipping_total: 27.5,
    })
  })

  it("should calculate order with items + taxes + adjustments", function () {
    const cart = {
      items: [
        {
          unit_price: 50,
          quantity: 2,
          fulfilled_quantity: 2,
          shipped_quantity: 2,
          return_requested_quantity: 0,
          return_received_quantity: 1,
          return_dismissed_quantity: 1,
          written_off_quantity: 0,
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
      items: [
        {
          unit_price: 50,
          quantity: 2,
          fulfilled_quantity: 2,
          shipped_quantity: 2,
          return_requested_quantity: 0,
          return_received_quantity: 1,
          return_dismissed_quantity: 1,
          written_off_quantity: 0,
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
          discount_total: 20,
          discount_tax_total: 2,
          tax_total: 8,
          original_tax_total: 10,
          fulfilled_total: 88,
          shipped_total: 88,
          return_requested_total: 0,
          return_received_total: 44,
          return_dismissed_total: 44,
          write_off_total: 0,
          refundable_total: 0,
          refundable_total_per_unit: 0,
        },
      ],
      total: 88,
      subtotal: 100,
      tax_total: 8,
      discount_total: 20,
      discount_tax_total: 2,
      original_total: 90,
      original_tax_total: 10,
      item_total: 88,
      item_subtotal: 100,
      items_refundable_total: 0,
      item_tax_total: 8,
      original_item_total: 110,
      original_item_subtotal: 100,
      original_item_tax_total: 10,
      fulfilled_total: 88,
      shipped_total: 88,
      return_requested_total: 0,
      return_received_total: 44,
      return_dismissed_total: 44,
      write_off_total: 0,
    })
  })
})
