import { describe, expect, it } from "vitest"
import { ConditionalPriceSchema } from "../../schema"
import { WEIGHT_TOTAL_ATTRIBUTE } from "../../constants"
import {
  buildShippingOptionPriceRules,
  buildWeightTotalPriceRules,
} from "../price-rule-helpers"

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

  it("should ignore weight_total thresholds when building item_total rules", () => {
    const rule = {
      gte: 10,
      lte: 100,
      weight_total_gte: 1,
      weight_total_lte: 5,
    }
    const rules = buildShippingOptionPriceRules(rule)
    expect(rules).toHaveLength(2)
    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attribute: "item_total",
          operator: "gte",
          value: 10,
        }),
        expect.objectContaining({
          attribute: "item_total",
          operator: "lte",
          value: 100,
        }),
      ])
    )
  })
})

describe("buildWeightTotalPriceRules", () => {
  it("should return an empty array when no conditions are provided", () => {
    const rules = buildWeightTotalPriceRules({})
    expect(rules).toEqual([])
  })

  it("should include weight_total gte and lte rules", () => {
    const rules = buildWeightTotalPriceRules({
      weight_total_gte: 1,
      weight_total_lte: 10,
    })
    expect(rules).toHaveLength(2)
    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attribute: "weight_total",
          operator: "gte",
          value: 1,
        }),
        expect.objectContaining({
          attribute: "weight_total",
          operator: "lte",
          value: 10,
        }),
      ])
    )
  })

  it("should exclude conditions with empty string values", () => {
    const rules = buildWeightTotalPriceRules({
      weight_total_gte: "",
      weight_total_lte: 100,
    })
    expect(rules).toHaveLength(1)
    expect(rules[0]).toMatchObject({ operator: "lte", value: 100 })
  })

  it("should set the correct WEIGHT_TOTAL attribute on all rules", () => {
    const rules = buildWeightTotalPriceRules({
      weight_total_gte: 0,
      weight_total_lte: 50,
    })
    rules.forEach((rule) => {
      expect(rule.attribute).toBe("weight_total")
    })
  })
})

describe("ConditionalPriceSchema validation", () => {
  it("should pass when item_total minimum is less than or equal to maximum", () => {
    const result = ConditionalPriceSchema.safeParse({
      amount: 10,
      gte: 1,
      lte: 5,
    })
    expect(result.success).toBe(true)
  })

  it("should fail when item_total minimum is greater than maximum", () => {
    const result = ConditionalPriceSchema.safeParse({
      amount: 10,
      gte: 10,
      lte: 5,
    })
    expect(result.success).toBe(false)
  })

  it("should pass when weight_total minimum is less than or equal to maximum", () => {
    const result = ConditionalPriceSchema.safeParse({
      amount: 10,
      weight_total_gte: 1,
      weight_total_lte: 5,
    })
    expect(result.success).toBe(true)
  })

  it("should fail when weight_total minimum is greater than maximum", () => {
    const result = ConditionalPriceSchema.safeParse({
      amount: 10,
      weight_total_gte: 10,
      weight_total_lte: 5,
    })
    expect(result.success).toBe(false)
  })

  it("should fail when no minimum or maximum is provided", () => {
    const result = ConditionalPriceSchema.safeParse({ amount: 10 })
    expect(result.success).toBe(false)
  })

  it("should pass when only weight_total minimum is provided", () => {
    const result = ConditionalPriceSchema.safeParse({
      amount: 10,
      weight_total_gte: 1,
    })
    expect(result.success).toBe(true)
  })

  it("should pass when both item_total and weight_total ranges are valid", () => {
    const result = ConditionalPriceSchema.safeParse({
      amount: 10,
      gte: 10,
      lte: 20,
      weight_total_gte: 1,
      weight_total_lte: 5,
    })
    expect(result.success).toBe(true)
  })

  it("should pass when only a weight_total maximum is provided", () => {
    const result = ConditionalPriceSchema.safeParse({
      amount: 10,
      weight_total_lte: 5,
    })
    expect(result.success).toBe(true)
  })

  it("should fail when the weight_total maximum is less than the minimum", () => {
    const result = ConditionalPriceSchema.safeParse({
      amount: 10,
      weight_total_gte: 5,
      weight_total_lte: 1,
    })
    expect(result.success).toBe(false)
  })
})

describe("combined item_total and weight_total rule building", () => {
  it("should produce a single rules array containing both attributes", () => {
    const itemRule = { gte: 10, lte: 100 }
    const weightRule = { weight_total_gte: 1, weight_total_lte: 5 }

    const itemRules = buildShippingOptionPriceRules(itemRule)
    const weightRules = buildWeightTotalPriceRules(weightRule)
    const combined = [...itemRules, ...weightRules]

    expect(combined).toHaveLength(4)
    expect(combined).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attribute: "item_total",
          operator: "gte",
          value: 10,
        }),
        expect.objectContaining({
          attribute: "item_total",
          operator: "lte",
          value: 100,
        }),
        expect.objectContaining({
          attribute: "weight_total",
          operator: "gte",
          value: 1,
        }),
        expect.objectContaining({
          attribute: "weight_total",
          operator: "lte",
          value: 5,
        }),
      ])
    )
  })

  it("should build weight_total rules when the attribute is passed explicitly", () => {
    const rules = buildShippingOptionPriceRules(
      { gte: 0, lte: 50 },
      WEIGHT_TOTAL_ATTRIBUTE
    )

    expect(rules).toHaveLength(2)
    rules.forEach((rule) => {
      expect(rule.attribute).toBe("weight_total")
    })
  })

  it("should keep item_total and weight_total thresholds independent", () => {
    const rule = {
      gte: 10,
      lte: 100,
      weight_total_gte: 1,
      weight_total_lte: 5,
    }

    const weightRules = buildWeightTotalPriceRules(rule)

    expect(weightRules).toEqual([
      {
        attribute: "weight_total",
        operator: "gte",
        value: 1,
      },
      {
        attribute: "weight_total",
        operator: "lte",
        value: 5,
      },
    ])
  })
})
