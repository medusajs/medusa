import { describe, expect, it } from "vitest"
import { buildShippingOptionPriceRules } from "../price-rule-helpers"

describe("buildShippingOptionPriceRules", () => {
  it("should return an empty array when no conditions are provided", () => {
    const rules = buildShippingOptionPriceRules({})
    expect(rules).toEqual([])
  })

  it("should include a gte rule with value 0", () => {
    const rules = buildShippingOptionPriceRules({ gte: 0 })
    expect(rules).toHaveLength(1)
    expect(rules[0]).toMatchObject({ operator: "gte", value: 0 })
  })

  it("should include a lte rule with value 0", () => {
    const rules = buildShippingOptionPriceRules({ lte: 0 })
    expect(rules).toHaveLength(1)
    expect(rules[0]).toMatchObject({ operator: "lte", value: 0 })
  })

  it("should include all conditions when some have value 0", () => {
    const rules = buildShippingOptionPriceRules({ gte: 0, lte: 100 })
    expect(rules).toHaveLength(2)
    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ operator: "gte", value: 0 }),
        expect.objectContaining({ operator: "lte", value: 100 }),
      ])
    )
  })

  it("should exclude conditions with null values", () => {
    const rules = buildShippingOptionPriceRules({ gte: 50, gt: null })
    expect(rules).toHaveLength(1)
    expect(rules[0]).toMatchObject({ operator: "gte", value: 50 })
  })

  it("should exclude conditions with undefined values", () => {
    const rules = buildShippingOptionPriceRules({
      gte: 50,
      lt: undefined,
      eq: undefined,
    })
    expect(rules).toHaveLength(1)
    expect(rules[0]).toMatchObject({ operator: "gte", value: 50 })
  })

  it("should build rules for all supported operators", () => {
    const rules = buildShippingOptionPriceRules({
      gte: 10,
      lte: 100,
      gt: 5,
      lt: 200,
      eq: 50,
    })
    expect(rules).toHaveLength(5)
    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ operator: "gte", value: 10 }),
        expect.objectContaining({ operator: "lte", value: 100 }),
        expect.objectContaining({ operator: "gt", value: 5 }),
        expect.objectContaining({ operator: "lt", value: 200 }),
        expect.objectContaining({ operator: "eq", value: 50 }),
      ])
    )
  })

  it("should exclude conditions with empty string values", () => {
    const rules = buildShippingOptionPriceRules({ gte: "", lte: 100 })
    expect(rules).toHaveLength(1)
    expect(rules[0]).toMatchObject({ operator: "lte", value: 100 })
  })

  it("should accept string values and cast them to numbers", () => {
    const rules = buildShippingOptionPriceRules({ gte: "0", lte: "100" })
    expect(rules).toHaveLength(2)
    expect(rules[0]).toMatchObject({ operator: "gte", value: 0 })
    expect(rules[1]).toMatchObject({ operator: "lte", value: 100 })
  })

  it("should set the correct ITEM_TOTAL attribute on all rules", () => {
    const rules = buildShippingOptionPriceRules({ gte: 0, lte: 50 })
    rules.forEach((rule) => {
      expect(rule.attribute).toBe("item_total")
    })
  })
})
