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
          subtotal_without_taxes: 60,
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
          subtotal_without_taxes: 5,
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
      subtotal_without_taxes: 65,
      tax_total: 8.5,
      discount_total: 0,
      discount_tax_total: 0,
      item_total: 73.5,
      item_subtotal: 65,
      item_tax_total: 8.5,
      original_total: 73.5,
      original_tax_total: 8.5,
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
            },
          ],
          subtotal: 100,
          subtotal_without_taxes: 100,
          total: 99,
          original_total: 110,
          discount_total: 10,
          discount_tax_total: 100,
          tax_total: 9,
          original_tax_total: 10,
        },
      ],
      total: 99,
      subtotal: 100,
      subtotal_without_taxes: 100,
      tax_total: 9,
      discount_total: 10,
      discount_tax_total: 100,
      original_total: 100,
      original_tax_total: 10,
      item_total: 99,
      item_subtotal: 100,
      item_tax_total: 9,
      original_item_total: 110,
      original_item_tax_total: 10,
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
          subtotal: 100,
          subtotal_without_taxes: 90.9090909090909,
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
      subtotal_without_taxes: 90.9090909090909,
      tax_total: 9.090909090909092,
      discount_total: 0,
      discount_tax_total: 0,
      original_total: 100,
      original_tax_total: 9.090909090909092,
      item_total: 100,
      item_subtotal: 100,
      item_tax_total: 9.090909090909092,
      original_item_total: 100,
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
          subtotal_without_taxes: 100,
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
      subtotal_without_taxes: 100,
      tax_total: 10,
      discount_total: 0,
      discount_tax_total: 0,
      original_total: 110,
      original_tax_total: 10,
      item_total: 110,
      item_subtotal: 100,
      item_tax_total: 10,
      original_item_total: 110,
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
          subtotal: 100,
          subtotal_without_taxes: 90.9090909090909,
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
          subtotal_without_taxes: 100,
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
      subtotal_without_taxes: 190.9090909090909,
      tax_total: 19.09090909090909,
      discount_total: 0,
      discount_tax_total: 0,
      original_total: 210,
      original_tax_total: 19.09090909090909,
      item_total: 210,
      item_subtotal: 200,
      item_tax_total: 19.09090909090909,
      original_item_total: 210,
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
            },
          ],
          subtotal: 100,
          subtotal_without_taxes: 100,
          total: 88,
          original_total: 110,
          discount_total: 20,
          discount_tax_total: 200,
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
            },
          ],
          subtotal: 25,
          total: 25.3,
          original_total: 27.5,
          discount_total: 2,
          discount_tax_total: 20,
          tax_total: 2.3,
          original_tax_total: 2.5,
        },
      ],
      total: 113.6,
      subtotal: 100,
      subtotal_without_taxes: 100,
      tax_total: 10.3,
      discount_total: 22,
      discount_tax_total: 220,
      original_total: 118,
      original_tax_total: 12.5,
      item_total: 88,
      item_subtotal: 100,
      item_tax_total: 8,
      original_item_total: 110,
      original_item_tax_total: 10,
      shipping_total: 25.3,
      shipping_subtotal: 25,
      shipping_tax_total: 2.3,
      original_shipping_tax_total: 2.5,
      original_shipping_total: 27.5,
    })
  })
})
