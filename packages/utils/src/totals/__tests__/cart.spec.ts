import { DecorateCartTotalsInputDTO, decorateCartTotals } from "../cart"

const generateCart = ({
  items = [],
  shipping_methods = [],
}: DecorateCartTotalsInputDTO) => ({
  items,
  shipping_methods,
})

describe("decorateCartTotals", () => {
  it("should return the same cart if no items or shipping methods are provided", () => {
    const cart = generateCart({})

    const result = decorateCartTotals(cart)

    expect(result).toEqual(cart)
  })

  it("should calculate totals correctly", () => {
    const cart = generateCart({
      items: [
        {
          id: "1",
          quantity: 2,
          unit_price: 10,
          raw_unit_price: {
            value: "10",
          },
        },
      ],
    })

    const result = decorateCartTotals(cart)
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        items: [
          {
            id: "1",
            quantity: 2,
            unit_price: 10,
            raw_unit_price: {
              value: "10",
            },
            subtotal: 20,
            total: 20,
            original_total: 20,
            discount_total: 0,
            tax_total: 0,
            original_tax_total: 0,
          },
        ],
        shipping_methods: [],
      })
    )
  })

  // TODO: Add more test cases as needed to cover all edge cases and functionality
})
