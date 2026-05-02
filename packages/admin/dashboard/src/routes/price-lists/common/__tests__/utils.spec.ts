import { describe, expect, it } from "vitest"
import { HttpTypes } from "@medusajs/types"
import {
  initRecord,
  convertToPriceArray,
  comparePrices,
  sortPrices,
  formatQuantityPrices,
} from "../utils"

const makePrice = (
  overrides: Partial<HttpTypes.AdminPriceListPrice> & {
    variant_id: string
    currency_code: string
    amount: number
    id: string
  }
): HttpTypes.AdminPriceListPrice =>
  ({
    rules: {},
    ...overrides,
  } as unknown as HttpTypes.AdminPriceListPrice)

const makeProduct = (
  id: string,
  variantIds: string[]
): HttpTypes.AdminProduct =>
  ({
    id,
    variants: variantIds.map((vid) => ({ id: vid, product_id: id })),
  } as unknown as HttpTypes.AdminProduct)

const makeRegion = (
  id: string,
  currencyCode: string
): HttpTypes.AdminRegion =>
  ({
    id,
    currency_code: currencyCode,
  } as unknown as HttpTypes.AdminRegion)

describe("initRecord", () => {
  it("should place a simple currency price in currency_prices", () => {
    const priceList = {
      prices: [
        makePrice({
          id: "price_1",
          variant_id: "var_1",
          currency_code: "usd",
          amount: 1000,
        }),
      ],
    } as unknown as HttpTypes.AdminPriceList

    const products = [makeProduct("prod_1", ["var_1"])]
    const result = initRecord(priceList, products)

    const variant = result["prod_1"].variants["var_1"]
    expect(variant.currency_prices["usd"]).toEqual([
      {
        amount: "1000",
        id: "price_1",
        min_quantity: undefined,
        max_quantity: undefined,
      },
    ])
    expect(variant.conditional_currency_prices).toEqual({})
  })

  it("should place a simple region price in region_prices", () => {
    const priceList = {
      prices: [
        makePrice({
          id: "price_2",
          variant_id: "var_1",
          currency_code: "eur",
          amount: 2000,
          rules: { region_id: "reg_eu" },
        }),
      ],
    } as unknown as HttpTypes.AdminPriceList

    const products = [makeProduct("prod_1", ["var_1"])]
    const result = initRecord(priceList, products)

    const variant = result["prod_1"].variants["var_1"]
    expect(variant.region_prices["reg_eu"]).toEqual([
      {
        amount: "2000",
        id: "price_2",
        min_quantity: undefined,
        max_quantity: undefined,
      },
    ])
    expect(variant.conditional_region_prices).toEqual({})
  })

  it("should place a tiered currency price in conditional_currency_prices", () => {
    const priceList = {
      prices: [
        makePrice({
          id: "price_3",
          variant_id: "var_1",
          currency_code: "usd",
          amount: 800,
          rules: { min_quantity: "10", max_quantity: "50" },
        }),
      ],
    } as unknown as HttpTypes.AdminPriceList

    const products = [makeProduct("prod_1", ["var_1"])]
    const result = initRecord(priceList, products)

    const variant = result["prod_1"].variants["var_1"]
    expect(variant.conditional_currency_prices!["usd"]).toEqual([
      {
        amount: "800",
        id: "price_3",
        min_quantity: "10",
        max_quantity: "50",
      },
    ])
    expect(variant.currency_prices["usd"]).toBeUndefined()
  })

  it("should place a tiered region price in conditional_region_prices", () => {
    const priceList = {
      prices: [
        makePrice({
          id: "price_4",
          variant_id: "var_1",
          currency_code: "eur",
          amount: 1500,
          rules: { region_id: "reg_eu", min_quantity: "5" },
        }),
      ],
    } as unknown as HttpTypes.AdminPriceList

    const products = [makeProduct("prod_1", ["var_1"])]
    const result = initRecord(priceList, products)

    const variant = result["prod_1"].variants["var_1"]
    expect(variant.conditional_region_prices!["reg_eu"]).toEqual([
      {
        amount: "1500",
        id: "price_4",
        min_quantity: "5",
        max_quantity: undefined,
      },
    ])
    expect(variant.region_prices["reg_eu"]).toBeUndefined()
  })

  it("should accumulate multiple prices for the same variant and currency", () => {
    const priceList = {
      prices: [
        makePrice({
          id: "price_a",
          variant_id: "var_1",
          currency_code: "usd",
          amount: 1000,
        }),
        makePrice({
          id: "price_b",
          variant_id: "var_1",
          currency_code: "usd",
          amount: 900,
          rules: { min_quantity: "10" },
        }),
      ],
    } as unknown as HttpTypes.AdminPriceList

    const products = [makeProduct("prod_1", ["var_1"])]
    const result = initRecord(priceList, products)

    const variant = result["prod_1"].variants["var_1"]
    expect(variant.currency_prices["usd"]).toHaveLength(1)
    expect(variant.conditional_currency_prices!["usd"]).toHaveLength(1)
  })

  it("should handle empty prices", () => {
    const priceList = { prices: [] } as unknown as HttpTypes.AdminPriceList
    const products = [makeProduct("prod_1", ["var_1"])]
    const result = initRecord(priceList, products)

    const variant = result["prod_1"].variants["var_1"]
    expect(variant.currency_prices).toEqual({})
    expect(variant.region_prices).toEqual({})
    expect(variant.conditional_currency_prices).toEqual({})
    expect(variant.conditional_region_prices).toEqual({})
  })
})

describe("convertToPriceArray", () => {
  const regions = [makeRegion("reg_eu", "eur")]

  it("should convert currency prices to price objects", () => {
    const data = {
      prod_1: {
        variants: {
          var_1: {
            currency_prices: {
              usd: [{ amount: "1000", id: "price_1" }],
            },
            region_prices: {},
            conditional_currency_prices: {},
            conditional_region_prices: {},
          },
        },
      },
    }

    const result = convertToPriceArray(data, regions)
    expect(result).toEqual([
      {
        variantId: "var_1",
        currencyCode: "usd",
        amount: 1000,
        id: "price_1",
        minQuantity: undefined,
        maxQuantity: undefined,
      },
    ])
  })

  it("should convert region prices using region currency map", () => {
    const data = {
      prod_1: {
        variants: {
          var_1: {
            currency_prices: {},
            region_prices: {
              reg_eu: [{ amount: "2000", id: "price_2" }],
            },
            conditional_currency_prices: {},
            conditional_region_prices: {},
          },
        },
      },
    }

    const result = convertToPriceArray(data, regions)
    expect(result).toEqual([
      {
        variantId: "var_1",
        regionId: "reg_eu",
        currencyCode: "eur",
        amount: 2000,
        id: "price_2",
        minQuantity: undefined,
        maxQuantity: undefined,
      },
    ])
  })

  it("should include conditional prices", () => {
    const data = {
      prod_1: {
        variants: {
          var_1: {
            currency_prices: {},
            region_prices: {},
            conditional_currency_prices: {
              usd: [
                {
                  amount: "800",
                  id: "price_3",
                  min_quantity: "10",
                  max_quantity: "50",
                },
              ],
            },
            conditional_region_prices: {},
          },
        },
      },
    }

    const result = convertToPriceArray(data, regions)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      amount: 800,
      minQuantity: 10,
      maxQuantity: 50,
    })
  })

  it("should skip empty amounts", () => {
    const data = {
      prod_1: {
        variants: {
          var_1: {
            currency_prices: {
              usd: [{ amount: "", id: "price_1" }],
            },
            region_prices: {},
            conditional_currency_prices: {},
            conditional_region_prices: {},
          },
        },
      },
    }

    const result = convertToPriceArray(data, regions)
    expect(result).toHaveLength(0)
  })
})

describe("comparePrices", () => {
  it("should detect new prices", () => {
    const initial: any[] = []
    const updated = [
      {
        variantId: "var_1",
        currencyCode: "usd",
        amount: 1000,
      },
    ]

    const { pricesToCreate, pricesToUpdate, pricesToDelete } = comparePrices(
      initial,
      updated
    )
    expect(pricesToCreate).toHaveLength(1)
    expect(pricesToUpdate).toHaveLength(0)
    expect(pricesToDelete).toHaveLength(0)
  })

  it("should detect deleted prices", () => {
    const initial = [
      {
        variantId: "var_1",
        currencyCode: "usd",
        amount: 1000,
        id: "price_1",
      },
    ]
    const updated: any[] = []

    const { pricesToCreate, pricesToDelete } = comparePrices(initial, updated)
    expect(pricesToCreate).toHaveLength(0)
    expect(pricesToDelete).toEqual(["price_1"])
  })

  it("should detect updated prices", () => {
    const initial = [
      {
        variantId: "var_1",
        currencyCode: "usd",
        amount: 1000,
        id: "price_1",
      },
    ]
    const updated = [
      {
        variantId: "var_1",
        currencyCode: "usd",
        amount: 2000,
        id: "price_1",
      },
    ]

    const { pricesToCreate, pricesToUpdate, pricesToDelete } = comparePrices(
      initial,
      updated
    )
    expect(pricesToCreate).toHaveLength(0)
    expect(pricesToDelete).toHaveLength(0)
    expect(pricesToUpdate).toHaveLength(1)
    expect(pricesToUpdate[0].amount).toBe(2000)
  })

  it("should detect NaN amount as delete", () => {
    const initial = [
      {
        variantId: "var_1",
        currencyCode: "usd",
        amount: 1000,
        id: "price_1",
      },
    ]
    const updated = [
      {
        variantId: "var_1",
        currencyCode: "usd",
        amount: NaN,
        id: "price_1",
      },
    ]

    const { pricesToDelete } = comparePrices(initial, updated)
    expect(pricesToDelete).toEqual(["price_1"])
  })
})

describe("sortPrices", () => {
  const regions = [makeRegion("reg_eu", "eur")]

  it("should compute diff between initial and current state", () => {
    const initial = {
      prod_1: {
        variants: {
          var_1: {
            currency_prices: {
              usd: [{ amount: "1000", id: "price_1" }],
            },
            region_prices: {},
            conditional_currency_prices: {},
            conditional_region_prices: {},
          },
        },
      },
    }

    const updated = {
      prod_1: {
        variants: {
          var_1: {
            currency_prices: {
              usd: [{ amount: "2000", id: "price_1" }],
            },
            region_prices: {},
            conditional_currency_prices: {},
            conditional_region_prices: {},
          },
        },
      },
    }

    const { pricesToUpdate } = sortPrices(updated, initial, regions)
    expect(pricesToUpdate).toHaveLength(1)
    expect(pricesToUpdate[0].amount).toBe(2000)
  })
})

describe("formatQuantityPrices", () => {
  it("should filter out empty amounts and cast numbers", () => {
    const prices = [
      { amount: "100", min_quantity: "5", max_quantity: "10" },
      { amount: "", min_quantity: "1" },
      { amount: "200" },
    ]

    const result = formatQuantityPrices(prices)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      amount: 100,
      min_quantity: 5,
      max_quantity: 10,
    })
    expect(result[1]).toEqual({
      amount: 200,
      min_quantity: undefined,
      max_quantity: undefined,
    })
  })

  it("should filter out whitespace-only amounts", () => {
    const prices = [{ amount: "   " }]
    const result = formatQuantityPrices(prices)
    expect(result).toHaveLength(0)
  })

  it("should preserve id field", () => {
    const prices = [{ amount: "500", id: "price_1" }]
    const result = formatQuantityPrices(prices)
    expect(result[0].id).toBe("price_1")
  })
})
