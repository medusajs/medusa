import TaxCalculationStrategy from "../tax-calculation"

const toTest = [
  {
    title: "calculates correctly without gift card",

    /*
     * Subtotal = 2 * 100 = 200
     * Taxable amount = 200 - 10 = 190
     * Taxline 1 = 190 * 0.0825 = 15.675
     * Taxline 2 = 190 * 0.125 = 13.75
     * Total tax = 39.425
     * Rounded = 39
     */
    expected: 39,
    items: [
      {
        id: "item_1",
        unit_price: 100,
        quantity: 2,
      },
    ],
    taxLines: [
      {
        item_id: "item_1",
        name: "Name 1",
        rate: 0.0825,
      },
      {
        item_id: "item_1",
        name: "Name 2",
        rate: 0.125,
      },
    ],
    context: {
      shipping_address: null,
      customer: {
        email: "test@testson.com",
      },
      region: {
        giftcards_taxable: false,
      },
      allocation_map: {
        item_1: {
          discount: {
            amount: 10,
          },
          gift_card: {
            amount: 10,
          },
        },
      },
    },
  },
  {
    title: "calculates correctly with gift card",

    /*
     * Subtotal = 2 * 100 = 200
     * Taxable amount = 200 - 10 = 180
     * Taxline 1 = 180 * 0.0825 = 14.85
     * Taxline 2 = 180 * 0.125 = 22.5
     * Total tax = 37.35
     * Rounded = 37
     */
    expected: 37,
    items: [
      {
        id: "item_1",
        unit_price: 100,
        quantity: 2,
      },
    ],
    taxLines: [
      {
        item_id: "item_1",
        name: "Name 1",
        rate: 0.0825,
      },
      {
        item_id: "item_1",
        name: "Name 2",
        rate: 0.125,
      },
    ],
    context: {
      shipping_address: null,
      customer: {
        email: "test@testson.com",
      },
      region: {
        giftcards_taxable: true,
      },
      allocation_map: {
        item_1: {
          discount: {
            amount: 10,
          },
          gift_card: {
            amount: 10,
          },
        },
      },
    },
  },
]

describe("TaxCalculationStrategy", () => {
  describe("calculate", () => {
    const calcStrat = new TaxCalculationStrategy()

    test.each(toTest)(
      "$title",
      async ({ items, taxLines, context, expected }) => {
        const val = await calcStrat.calculate(items, taxLines, context)
        expect(val).toEqual(expected)
      }
    )
  })
})
