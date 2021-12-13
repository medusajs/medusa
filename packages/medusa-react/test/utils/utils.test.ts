import { RegionInfo } from "./../../src/types"
import { ProductVariant } from "@medusajs/medusa"
import { fixtures } from "./../../mocks/data/"
import {
  calculateVariantPrice,
  findVariantPrice,
  computeAmount,
  formatAmount,
  convertToLocale,
} from "./../../src/"

describe("findVariantPrice", () => {
  test("finds the variant price and returns its amount", () => {
    const variant = fixtures.get("product_variant")
    const region = fixtures.get("region")
    const amount = findVariantPrice(
      variant as unknown as ProductVariant,
      region
    )

    expect(amount).toEqual(1000)
  })

  test("when no region is provided, then it should return 0", () => {
    const variant = fixtures.get("product_variant")
    const amount = findVariantPrice(
      variant as unknown as ProductVariant,
      {} as RegionInfo
    )

    expect(amount).toEqual(0)
  })

  test("when no product variant is provided, then it should return 0", () => {
    const region = fixtures.get("region")
    const amount = findVariantPrice({} as ProductVariant, region)

    expect(amount).toEqual(0)
  })

  test("when no product variant and region are provided, then it should return 0", () => {
    const amount = findVariantPrice({} as ProductVariant, {} as RegionInfo)

    expect(amount).toEqual(0)
  })
})

describe("computeAmount", () => {
  test("given an amount and a region, it should return a decimal amount not including taxes", () => {
    const region = fixtures.get("region")
    const amount = computeAmount(3000, region, false)

    expect(amount).toEqual(30)
  })

  test("given an amount and a region, it should return a decimal amount including taxes", () => {
    const region = fixtures.get("region")
    const amount = computeAmount(3000, {
      ...region,
      tax_rate: 10,
    })

    expect(amount).toEqual(33)
  })

  test("when no region is provided, then it should return the decimal amount", () => {
    const region = fixtures.get("region")
    const amount = computeAmount(2000, region)

    expect(amount).toEqual(20)
  })
})

describe("calculateVariantPrice", () => {
  test("finds the variant price and returns a decimal amount not including taxes", () => {
    const variant = fixtures.get("product_variant")
    const region = fixtures.get("region")
    const price = calculateVariantPrice(
      variant as unknown as ProductVariant,
      region
    )

    expect(price).toEqual(10)
  })

  test("finds the variant price and returns a decimal amount including taxes", () => {
    const variant = fixtures.get("product_variant")
    const region = fixtures.get("region")
    const price = calculateVariantPrice(
      variant as unknown as ProductVariant,
      {
        ...region,
        tax_rate: 15,
      },
      true
    )

    expect(price).toEqual(11.5)
  })
})

describe("convertToLocale", () => {
  test("given an amount and currency code (usd), should return a localized version of the amount with the same currency code", () => {
    const price = convertToLocale({
      amount: 15,
      currency_code: "usd",
    })

    expect(price).toBe("$15.00")
  })
})

describe("formatAmount", () => {
  test("given an amount and region, should return a decimal localized amount including taxes and the region's currency code", () => {
    const region = fixtures.get("region")
    const price = formatAmount(3000, {
      ...region,
      tax_rate: 15,
    })

    expect(price).toBe("$34.50")
  })

  test("given an amount and no region, should return a decimal localized amount", () => {
    const price = formatAmount(3000, {} as RegionInfo)

    expect(price).toBe(30)
  })
})
