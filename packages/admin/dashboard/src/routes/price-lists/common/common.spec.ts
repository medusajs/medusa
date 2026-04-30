import { describe, it, expect } from "vitest"
import {
  PriceListCreateCurrencyPriceSchema,
  PriceListUpdateCurrencyPriceSchema,
} from "./schemas"
import {
  initRecord,
  convertToPriceArray,
  comparePrices,
  sortPrices,
  formatQuantityPrices,
} from "./utils"
import { HttpTypes } from "@medusajs/types"

describe("Price List Common Logic", () => {
  describe("Schemas", () => {
    it("PriceListCreateCurrencyPriceSchema should allow quantity fields", () => {
      const data = {
        amount: "100",
        min_quantity: "1",
        max_quantity: "10",
      }
      expect(PriceListCreateCurrencyPriceSchema.parse(data)).toEqual(data)
    })

    it("PriceListUpdateCurrencyPriceSchema should allow quantity fields", () => {
      const data = {
        amount: "100",
        min_quantity: "1",
        max_quantity: "10",
        id: "price_123",
      }
      expect(PriceListUpdateCurrencyPriceSchema.parse(data)).toEqual(data)
    })
  })

  describe("Utilities", () => {
    const mockRegions: HttpTypes.AdminRegion[] = [
      {
        id: "reg_1",
        currency_code: "usd",
        name: "USA",
      } as any,
    ]

    const mockProducts: HttpTypes.AdminProduct[] = [
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
            title: "Variant 1",
          } as any,
        ],
      } as any,
    ]

    const mockPriceList: HttpTypes.AdminPriceList = {
      id: "pl_1",
      prices: [
        {
          id: "price_1",
          variant_id: "var_1",
          amount: 100,
          currency_code: "usd",
          rules: {
            min_quantity: 1,
            max_quantity: 10,
          },
        } as any,
      ],
    } as any

    it("initRecord should correctly initialize record with quantities", () => {
      const record = initRecord(mockPriceList, mockProducts)
      expect(record["prod_1"].variants["var_1"].currency_prices["usd"]).toEqual([
        {
          amount: "100",
          id: "price_1",
          min_quantity: "1",
          max_quantity: "10",
        },
      ])
    })

    it("initRecord should handle multiple prices per currency", () => {
      const multiPriceList: HttpTypes.AdminPriceList = {
        ...mockPriceList,
        prices: [
          {
            id: "price_1",
            variant_id: "var_1",
            amount: 100,
            currency_code: "usd",
            rules: { min_quantity: 1, max_quantity: 10 },
          } as any,
          {
            id: "price_2",
            variant_id: "var_1",
            amount: 80,
            currency_code: "usd",
            rules: { min_quantity: 11, max_quantity: 20 },
          } as any,
        ],
      }
      const record = initRecord(multiPriceList, mockProducts)
      expect(record["prod_1"].variants["var_1"].currency_prices["usd"]).toEqual([
        {
          amount: "100",
          id: "price_1",
          min_quantity: "1",
          max_quantity: "10",
        },
        {
          amount: "80",
          id: "price_2",
          min_quantity: "11",
          max_quantity: "20",
        },
      ])
    })

    it("convertToPriceArray should correctly convert data to price array with quantities", () => {
      const data = {
        prod_1: {
          variants: {
            var_1: {
              currency_prices: {
                usd: [
                  {
                    amount: "100",
                    id: "price_1",
                    min_quantity: "1",
                    max_quantity: "10",
                  },
                  {
                    amount: "80",
                    id: "price_2",
                    min_quantity: "11",
                    max_quantity: "20",
                  },
                ],
              },
              region_prices: {},
            },
          },
        },
      }
      const prices = convertToPriceArray(data as any, mockRegions)
      expect(prices).toHaveLength(2)
      expect(prices[0]).toEqual({
        variantId: "var_1",
        currencyCode: "usd",
        amount: 100,
        id: "price_1",
        minQuantity: 1,
        maxQuantity: 10,
      })
      expect(prices[1]).toEqual({
        variantId: "var_1",
        currencyCode: "usd",
        amount: 80,
        id: "price_2",
        minQuantity: 11,
        maxQuantity: 20,
      })
    })

    it("comparePrices should detect changes in quantities", () => {
      const initialPrices = [
        {
          variantId: "var_1",
          currencyCode: "usd",
          amount: 100,
          id: "price_1",
          minQuantity: 1,
          maxQuantity: 10,
        },
      ]
      const newPrices = [
        {
          variantId: "var_1",
          currencyCode: "usd",
          amount: 100,
          id: "price_1",
          minQuantity: 1,
          maxQuantity: 20,
        },
      ]
      const { pricesToUpdate } = comparePrices(initialPrices, newPrices)
      expect(pricesToUpdate[0]).toEqual({
        id: "price_1",
        variant_id: "var_1",
        currency_code: "usd",
        amount: 100,
        min_quantity: 1,
        max_quantity: 20,
        rules: {},
      })
    })

    it("comparePrices should handle adding a new quantity rule", () => {
      const initialPrices = [
        {
          variantId: "var_1",
          currencyCode: "usd",
          amount: 100,
          id: "price_1",
          minQuantity: 1,
          maxQuantity: 10,
        },
      ]
      const newPrices = [
        {
          variantId: "var_1",
          currencyCode: "usd",
          amount: 100,
          id: "price_1",
          minQuantity: 1,
          maxQuantity: 10,
        },
        {
          variantId: "var_1",
          currencyCode: "usd",
          amount: 80,
          id: undefined,
          minQuantity: 11,
          maxQuantity: 20,
        },
      ]
      const { pricesToCreate } = comparePrices(initialPrices, newPrices)
      expect(pricesToCreate).toHaveLength(1)
      expect(pricesToCreate[0]).toEqual({
        variant_id: "var_1",
        currency_code: "usd",
        amount: 80,
        min_quantity: 11,
        max_quantity: 20,
        rules: {},
      })
    })

    it("comparePrices should handle price amount change without quantity change", () => {
      const initialPrices = [
        {
          variantId: "var_1",
          currencyCode: "usd",
          amount: 100,
          id: "price_1",
          minQuantity: 1,
          maxQuantity: 10,
        },
      ]
      const newPrices = [
        {
          variantId: "var_1",
          currencyCode: "usd",
          amount: 90,
          id: "price_1",
          minQuantity: 1,
          maxQuantity: 10,
        },
      ]
      const { pricesToUpdate } = comparePrices(initialPrices, newPrices)
      expect(pricesToUpdate).toHaveLength(1)
      expect(pricesToUpdate[0]).toEqual({
        id: "price_1",
        variant_id: "var_1",
        currency_code: "usd",
        amount: 90,
        min_quantity: 1,
        max_quantity: 10,
        rules: {},
      })
    })

    it("comparePrices should handle removing a price (NaN amount)", () => {
      const initialPrices = [
        {
          variantId: "var_1",
          currencyCode: "usd",
          amount: 100,
          id: "price_1",
        },
      ]
      const newPrices = [
        {
          variantId: "var_1",
          currencyCode: "usd",
          amount: NaN,
          id: "price_1",
        },
      ]
      const { pricesToDelete } = comparePrices(initialPrices, newPrices)
      expect(pricesToDelete).toContain("price_1")
    })

    it("initRecord should handle prices with no quantity rules", () => {
      const noQuantityPriceList: HttpTypes.AdminPriceList = {
        ...mockPriceList,
        prices: [
          {
            id: "price_1",
            variant_id: "var_1",
            amount: 100,
            currency_code: "usd",
            rules: {},
          } as any,
        ],
      }
      const record = initRecord(noQuantityPriceList, mockProducts)
      expect(record["prod_1"].variants["var_1"].currency_prices["usd"]).toEqual([
        {
          amount: "100",
          id: "price_1",
          min_quantity: undefined,
          max_quantity: undefined,
        },
      ])
    })

    it("convertToPriceArray should handle region prices with quantities", () => {
      const data = {
        prod_1: {
          variants: {
            var_1: {
              currency_prices: {},
              region_prices: {
                reg_1: [
                  {
                    amount: "50",
                    id: "price_r1",
                    min_quantity: "5",
                    max_quantity: "15",
                  },
                ],
              },
            },
          },
        },
      }
      const prices = convertToPriceArray(data as any, mockRegions)
      expect(prices).toHaveLength(1)
      expect(prices[0]).toEqual({
        variantId: "var_1",
        regionId: "reg_1",
        currencyCode: "usd",
        amount: 50,
        id: "price_r1",
        minQuantity: 5,
        maxQuantity: 15,
      })
    })

    it("sortPrices should correctly identify prices to create with quantities", () => {
      const initialValue = {
        prod_1: {
          variants: {
            var_1: {
              currency_prices: {},
            },
          },
        },
      }
      const newValue = {
        prod_1: {
          variants: {
            var_1: {
              currency_prices: {
                usd: [
                  {
                    amount: "100",
                    min_quantity: "1",
                    max_quantity: "10",
                  },
                ],
              },
              region_prices: {},
            },
          },
        },
      }
      const { pricesToCreate } = sortPrices(newValue as any, initialValue as any, mockRegions)
      expect(pricesToCreate[0]).toEqual({
        variant_id: "var_1",
        currency_code: "usd",
        amount: 100,
        min_quantity: 1,
        max_quantity: 10,
        rules: {},
      })
    })

    describe("formatQuantityPrices", () => {
      it("should keep valid price tiers and cast values to numbers", () => {
        const prices = [
          {
            amount: "100",
            min_quantity: "1",
            max_quantity: "10",
          },
          {
            amount: "80",
            min_quantity: "11",
            max_quantity: "20",
          },
        ]
        const result = formatQuantityPrices(prices)
        expect(result).toHaveLength(2)
        expect(result[0]).toEqual({
          amount: 100,
          min_quantity: 1,
          max_quantity: 10,
        })
        expect(result[1]).toEqual({
          amount: 80,
          min_quantity: 11,
          max_quantity: 20,
        })
      })

      it("should remove tiers with empty or whitespace-only amount", () => {
        const prices = [
          {
            amount: "100",
            min_quantity: "1",
            max_quantity: "10",
          },
          {
            amount: "",
            min_quantity: "11",
            max_quantity: "20",
          },
          {
            amount: "   ",
            min_quantity: "21",
            max_quantity: "30",
          },
        ]
        const result = formatQuantityPrices(prices)
        expect(result).toHaveLength(1)
        expect(result[0].amount).toBe(100)
      })

      it("should handle missing quantity fields", () => {
        const prices = [
          {
            amount: "100",
            min_quantity: undefined,
            max_quantity: undefined,
          },
        ]
        const result = formatQuantityPrices(prices)
        expect(result[0]).toEqual({
          amount: 100,
          min_quantity: undefined,
          max_quantity: undefined,
        })
      })
    })
  })
})
