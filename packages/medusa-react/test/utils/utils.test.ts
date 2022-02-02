import { RegionInfo, ProductVariantInfo } from "./../../src/types"
import { fixtures } from "./../../mocks/data/"
import {
  computeVariantPrice,
  getVariantPrice,
  computeAmount,
  formatAmount,
  formatVariantPrice,
} from "./../../src/"

describe("getVariantPrice", () => {
  test("finds the variant price and returns its amount", () => {
    const variant = fixtures.get("product_variant")
    const region = fixtures.get("region")
    const amount = getVariantPrice(
      (variant as unknown) as ProductVariantInfo,
      region
    )

    expect(amount).toEqual(1000)
  })

  test("when no region is provided, then it should return 0", () => {
    const variant = fixtures.get("product_variant")
    const amount = getVariantPrice(
      (variant as unknown) as ProductVariantInfo,
      {} as RegionInfo
    )

    expect(amount).toEqual(0)
  })

  test("when no product variant is provided, then it should return 0", () => {
    const region = fixtures.get("region")
    const amount = getVariantPrice({} as ProductVariantInfo, region)

    expect(amount).toEqual(0)
  })

  test("when no product variant and region are provided, then it should return 0", () => {
    const amount = getVariantPrice({} as ProductVariantInfo, {} as RegionInfo)

    expect(amount).toEqual(0)
  })
})

describe("computeAmount", () => {
  test("given an amount and a region, it should return a decimal amount not including taxes", () => {
    const region = fixtures.get("region")
    const amount = computeAmount({ amount: 3000, region, includeTaxes: false })

    expect(amount).toEqual(30)
  })

  test("given an amount and a region, it should return a decimal amount including taxes", () => {
    const region = fixtures.get("region")
    const amount = computeAmount({
      amount: 3000,
      region: {
        ...region,
        tax_rate: 10,
      },
    })

    expect(amount).toEqual(33)
  })

  test("when no region is provided, then it should return the decimal amount", () => {
    const region = fixtures.get("region")
    const amount = computeAmount({ amount: 2000, region })

    expect(amount).toEqual(20)
  })
})

describe("computeVariantPrice", () => {
  test("finds the variant price and returns a decimal amount not including taxes", () => {
    const variant = fixtures.get("product_variant")
    const region = fixtures.get("region")
    const price = computeVariantPrice({
      variant: (variant as unknown) as ProductVariantInfo,
      region,
    })

    expect(price).toEqual(10)
  })

  test("finds the variant price and returns a decimal amount including taxes", () => {
    const variant = fixtures.get("product_variant")
    const region = fixtures.get("region")
    const price = computeVariantPrice({
      variant: (variant as unknown) as ProductVariantInfo,
      region: {
        ...region,
        tax_rate: 15,
      },
      includeTaxes: true,
    })

    expect(price).toEqual(11.5)
  })
})

describe("formatVariantPrice", () => {
  test("given a variant and region, should return a decimal localized amount including taxes and the region's currency code", () => {
    const region = fixtures.get("region")
    const variant = fixtures.get("product_variant")
    const price = formatVariantPrice({
      variant: (variant as unknown) as ProductVariantInfo,
      region: {
        ...region,
        tax_rate: 15,
      },
    })

    expect(price).toEqual("$11.50")
  })

  test("given a variant, region, and a custom locale, should return a decimal localized amount including taxes and the region's currency code", () => {
    const region = fixtures.get("region")
    const variant = fixtures.get("product_variant")
    const price = formatVariantPrice({
      variant: (variant as unknown) as ProductVariantInfo,
      region: {
        ...region,
        tax_rate: 15,
      },
      locale: "fr-FR",
    })

    expect(price.replace(/\s/, " ")).toEqual("11,50 $US")
  })
})

describe("formatAmount", () => {
  test("given an amount and region, should return a decimal localized amount including taxes and the region's currency code", () => {
    const region = fixtures.get("region")
    const price = formatAmount({
      amount: 3000,
      region: {
        ...region,
        tax_rate: 15,
      },
    })

    expect(price).toEqual("$34.50")
  })

  test("given an amount and no region, should return a decimal localized amount", () => {
    const price = formatAmount({ amount: 3000, region: {} as RegionInfo })

    expect(price).toEqual("30")
  })
})
