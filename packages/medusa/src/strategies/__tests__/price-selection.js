import { isNonNullExpression } from "typescript"
import PriceSelectionStrategy from "../price-selection"

const toTest = [
  [
    "With only default price",
    {
      variant_id: "test-basic-variant",
      context: {
        region: {
          id: "test-region",
          currency_code: "dkk",
        },
      },
      validate: (value, { mockMoneyAmountRepository }) => {
        expect(
          mockMoneyAmountRepository.findDefaultForVariantInRegion
        ).toHaveBeenCalledWith("test-basic-variant", "test-region", "dkk")
        expect(value).toEqual({
          originalPrice: 100,
          calculatedPrice: 100,
          prices: [{ amount: 100 }],
        })
      },
    },
  ],
  [
    "Throws correct error if no default price is found, missing variant",
    {
      variant_id: "non-existing-variant",
      context: {
        region: {
          id: "test-region",
          currency_code: "dkk",
        },
      },
      validate: (value, { mockMoneyAmountRepository }) => {},
      validateException: (error, { mockMoneyAmountRepository }) => {
        expect(error.type).toEqual("not_found")
        expect(error.message).toEqual(
          "Money amount for variant with id non-existing-variant in region undefined does not exist"
        )
      },
    },
  ],
  [
    "findManyForVariantInRegion is invoked with the correct customer",
    {
      variant_id: "test-basic-variant",
      context: {
        region: {
          id: "test-region",
          currency_code: "dkk",
        },
        customer_id: "test-customer-1",
      },
      validate: (value, { mockMoneyAmountRepository }) => {
        expect(
          mockMoneyAmountRepository.findManyForVariantInRegion
        ).toHaveBeenCalledWith(
          "test-basic-variant",
          "test-region",
          "dkk",
          "test-customer-1"
        )
      },
    },
  ],
  [
    "Lowest valid price is returned",
    {
      variant_id: "test-basic-variant",
      context: {
        region: {
          id: "test-region",
          currency_code: "dkk",
        },
        customer_id: "test-customer-1",
      },
      validate: (value, { mockMoneyAmountRepository }) => {
        expect(value).toEqual({
          originalPrice: 100,
          calculatedPrice: 50,
          prices: [{ amount: 100 }, { amount: 50 }],
        })
      },
    },
  ],
  [
    "Prices with quantity limits are ignored with no provided quantity",
    {
      variant_id: "test-basic-variant",
      context: {
        region: {
          id: "test-region",
          currency_code: "dkk",
        },
        customer_id: "test-customer-2",
      },
      validate: (value, { mockMoneyAmountRepository }) => {
        expect(value).toEqual({
          originalPrice: 100,
          calculatedPrice: 100,
          prices: [
            { amount: 100 },
            { amount: 30, min_quantity: 10, max_quantity: 10 },
            { amount: 20, min_quantity: 10, max_quantity: 10 },
            { amount: 50, min_quantity: 5, max_quantity: 10 },
          ],
        })
      },
    },
  ],
  [
    "Prices With quantity limits are applied correctly when a quantity is provided",
    {
      variant_id: "test-basic-variant",
      context: {
        region: {
          id: "test-region",
          currency_code: "dkk",
        },
        customer_id: "test-customer-2",
        quantity: 7,
      },
      validate: (value, { mockMoneyAmountRepository }) => {
        console.log(value)
        expect(value).toEqual({
          originalPrice: 100,
          calculatedPrice: 50,
          prices: [
            { amount: 100 },
            { amount: 30, min_quantity: 10, max_quantity: 10 },
            { amount: 20, min_quantity: 10, max_quantity: 10 },
            { amount: 50, min_quantity: 5, max_quantity: 10 },
          ],
        })
      },
    },
  ],
  [
    "Prices with quantity are in prices array with no quantity set",
    {
      variant_id: "test-basic-variant",
      context: {
        region: {
          id: "test-region",
          currency_code: "dkk",
        },
        customer_id: "test-customer-2",
      },
      validate: (value, { mockMoneyAmountRepository }) => {
        expect(value).toEqual({
          originalPrice: 100,
          calculatedPrice: 100,
          prices: [
            { amount: 100 },
            { amount: 30, min_quantity: 10, max_quantity: 10 },
            { amount: 20, min_quantity: 10, max_quantity: 10 },
            { amount: 50, min_quantity: 5, max_quantity: 10 },
          ],
        })
      },
    },
  ],
]

describe("PriceSelectionStrategy", () => {
  describe("calculateVariantPrice", () => {
    test.each(toTest)(
      "%s",
      async (title, { variant_id, context, validate, validateException }) => {
        const mockMoneyAmountRepository = {
          findDefaultForVariantInRegion: jest
            .fn()
            .mockImplementation(
              async (variant_id, region_id, currency_code) => {
                if (variant_id === "test-basic-variant") {
                  return { amount: 100 }
                }
                return undefined
              }
            ),
          findManyForVariantInRegion: jest
            .fn()
            .mockImplementation(
              async (variant_id, region_id, currency_code, customer_id) => {
                if (customer_id === "test-customer-1") {
                  return [{ amount: 50 }]
                }
                if (customer_id === "test-customer-2") {
                  return [
                    { amount: 30, min_quantity: 10, max_quantity: 10 },
                    { amount: 20, max_quantity: 10, min_quantity: 10 },
                    { amount: 50, min_quantity: 5, max_quantity: 10 },
                  ]
                }
                return []
              }
            ),
        }

        const selectionStrategy = new PriceSelectionStrategy({
          moneyAmountRepository: mockMoneyAmountRepository,
        })

        try {
          const val = await selectionStrategy.calculateVariantPrice(
            variant_id,
            context
          )

          validate(val, { mockMoneyAmountRepository })
        } catch (error) {
          if (typeof validateException === "function") {
            validateException(error, { mockMoneyAmountRepository })
          } else {
            throw error
          }
        }
      }
    )
  })
})
