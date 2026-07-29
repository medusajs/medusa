import { describe, expect, it } from "vitest"
import { CondtionalPriceRuleSchema } from "../schema"

type ParseResult = ReturnType<typeof CondtionalPriceRuleSchema.safeParse>

const getIssuePaths = (result: ParseResult) =>
  result.success ? [] : result.error.issues.map((i) => i.path.join("."))

describe("CondtionalPriceRuleSchema - conditional shipping option prices", () => {
  it("allows the same amount for non-overlapping conditions", () => {
    const result = CondtionalPriceRuleSchema.safeParse({
      prices: [
        { amount: 10, gte: 0, lte: 50 },
        { amount: 10, gte: 51, lte: 100 },
      ],
    })

    expect(result.success).toBe(true)
  })

  it("allows different amounts for non-overlapping conditions", () => {
    const result = CondtionalPriceRuleSchema.safeParse({
      prices: [
        { amount: 10, gte: 0, lte: 50 },
        { amount: 5, gte: 51, lte: 100 },
      ],
    })

    expect(result.success).toBe(true)
  })

  it("allows a gte-only and lte-only rule that do not overlap", () => {
    const result = CondtionalPriceRuleSchema.safeParse({
      prices: [
        { amount: 10, gte: null, lte: 50 },
        { amount: 10, gte: 100, lte: null },
      ],
    })

    expect(result.success).toBe(true)
  })

  it("rejects overlapping ranges regardless of the amount", () => {
    const result = CondtionalPriceRuleSchema.safeParse({
      prices: [
        { amount: 10, gte: 0, lte: 60 },
        { amount: 5, gte: 50, lte: 100 },
      ],
    })

    expect(result.success).toBe(false)
    expect(getIssuePaths(result)).toContain("prices.1.gte")
  })

  it("rejects ranges that touch at an inclusive boundary", () => {
    const result = CondtionalPriceRuleSchema.safeParse({
      prices: [
        { amount: 10, gte: 0, lte: 50 },
        { amount: 20, gte: 50, lte: 100 },
      ],
    })

    expect(result.success).toBe(false)
    expect(getIssuePaths(result)).toContain("prices.1.gte")
  })

  it("rejects a nested/contained range", () => {
    const result = CondtionalPriceRuleSchema.safeParse({
      prices: [
        { amount: 10, gte: 0, lte: 100 },
        { amount: 10, gte: 25, lte: 50 },
      ],
    })

    expect(result.success).toBe(false)
  })

  it("rejects an unbounded gte-only rule overlapping a bounded rule", () => {
    const result = CondtionalPriceRuleSchema.safeParse({
      prices: [
        { amount: 10, gte: 0, lte: null },
        { amount: 10, gte: 200, lte: 300 },
      ],
    })

    expect(result.success).toBe(false)
  })

  it("accepts a single valid conditional price", () => {
    const result = CondtionalPriceRuleSchema.safeParse({
      prices: [{ amount: 10, gte: 0, lte: 50 }],
    })

    expect(result.success).toBe(true)
  })
})
