import { FlagRouter } from "../../utils/flag-router"
import TaxCalculationStrategy from "../tax-calculation"
import TaxInclusivePricingFeatureFlag from "../../loaders/feature-flags/tax-inclusive-pricing"
import { featureFlagRouter } from "../../loaders/feature-flags"

const toTest = [
  [
    "calculates correctly without gift card",
    {
      /*
       * Subtotal = 2 * 100 = 200
       * Taxable amount = 200 - 10 = 190
       * Taxline 1 = 190 * 0.0825 = 15.675 = 16
       * Taxline 2 = 190 * 0.125 = 13.75 = 14
       * Total tax = 40
       */
      expected: 40,
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
          rate: 8.25,
        },
        {
          item_id: "item_1",
          name: "Name 2",
          rate: 12.5,
        },
      ],
      context: {
        shipping_address: null,
        customer: {
          email: "test@testson.com",
        },
        shipping_methods: [],
        region: {
          gift_cards_taxable: false,
        },
        allocation_map: {
          item_1: {
            discount: {
              amount: 10,
              unit_amount: 5,
            },
            gift_card: {
              amount: 10,
              unit_amount: 5,
            },
          },
        },
      },
    },
  ],
  [
    "calculates correctly with gift card",
    {
      /*
       * Subtotal = 2 * 100 = 200
       * Taxable amount = 200 - 10 = 180
       * Taxline 1 = 180 * 0.0825 = 15
       * Taxline 2 = 180 * 0.125 = 23
       * Total tax = 38
       */
      expected: 40,
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
          rate: 8.25,
        },
        {
          item_id: "item_1",
          name: "Name 2",
          rate: 12.5,
        },
      ],
      context: {
        shipping_address: null,
        customer: {
          email: "test@testson.com",
        },
        region: {
          gift_cards_taxable: true,
        },
        shipping_methods: [],
        allocation_map: {
          item_1: {
            discount: {
              amount: 10,
              unit_amount: 5,
            },
            gift_card: {
              amount: 10,
              unit_amount: 5,
            },
          },
        },
      },
    },
  ],
]

const taxInclusiveShippingTests = [
  [
    "calculates correctly with tax inclusive shipping",
    {
      expected: 25,
      items: [],
      taxLines: [
        {
          shipping_method_id: "shipping_method_1",
          name: "Name 1",
          rate: 25,
        },
        {
          shipping_method_id: "shipping_method_2",
          name: "Name 2",
          rate: 10,
        },
      ],
      context: {
        shipping_methods: [
          { id: "shipping_method_1", price: 100, includes_tax: true },
          { id: "shipping_method_2", price: 50, includes_tax: false },
        ],
      },
    },
  ],
]
describe("TaxCalculationStrategy", () => {
  ;[true, false].forEach((taxInclusivePricingEnabled) => {
    describe(`calculate (tax inclusive: ${taxInclusivePricingEnabled})`, () => {
      const featureFlagRouter = new FlagRouter({
        tax_inclusive_pricing: taxInclusivePricingEnabled,
      })

      const calcStrat = new TaxCalculationStrategy({ featureFlagRouter })

      test.each(toTest)(
        "%s",
        async (title, { items, taxLines, context, expected }) => {
          const val = await calcStrat.calculate(items, taxLines, context)
          expect(val).toEqual(expected)
        }
      )
    })
  })

  describe("tax inclusive calculations", () => {
    const featureFlagRouter = new FlagRouter({
      tax_inclusive_pricing: true,
    })
    describe("shipping methods tax", () => {
      const calcStrat = new TaxCalculationStrategy({ featureFlagRouter })

      test.each(taxInclusiveShippingTests)(
        "%s",
        async (title, { items, taxLines, context, expected }) => {
          const val = await calcStrat.calculate(items, taxLines, context)
          expect(val).toEqual(expected)
        }
      )
    })
  })
})
