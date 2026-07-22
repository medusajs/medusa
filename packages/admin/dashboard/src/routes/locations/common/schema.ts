import { t } from "i18next"
import { z } from "zod"
import { castNumber } from "../../../lib/cast-number"

export const ConditionalPriceSchema = z
  .object({
    amount: z.union([z.string(), z.number()]),
    gte: z.union([z.string(), z.number()]).nullish(),
    lte: z.union([z.string(), z.number()]).nullish(),
    lt: z.number().nullish(),
    gt: z.number().nullish(),
    eq: z.number().nullish(),
  })
  .refine((data) => data.amount !== "", {
    message: t(
      "stockLocations.shippingOptions.conditionalPrices.errors.amountRequired"
    ),
    path: ["amount"],
  })
  .refine(
    (data) => {
      const hasEqLtGt =
        data.eq !== undefined || data.lt !== undefined || data.gt !== undefined

      // The rule has operators that can only be managed using the API, so we should not validate this.
      if (hasEqLtGt) {
        return true
      }

      return (
        (data.gte !== undefined && data.gte !== "") ||
        (data.lte !== undefined && data.lte !== "")
      )
    },
    {
      message: t(
        "stockLocations.shippingOptions.conditionalPrices.errors.minOrMaxRequired"
      ),
      path: ["gte"],
    }
  )
  .refine(
    (data) => {
      if (
        data.gte != null &&
        data.gte !== "" &&
        data.lte != null &&
        data.lte !== ""
      ) {
        const gte = castNumber(data.gte)
        const lte = castNumber(data.lte)
        return gte <= lte
      }
      return true
    },
    {
      message: t(
        "stockLocations.shippingOptions.conditionalPrices.errors.minGreaterThanMax"
      ),
      path: ["gte"],
    }
  )

export type ConditionalPrice = z.infer<typeof ConditionalPriceSchema>

export const UpdateConditionalPriceSchema = ConditionalPriceSchema.and(
  z.object({
    id: z.string().optional(),
  })
)

export type UpdateConditionalPrice = z.infer<
  typeof UpdateConditionalPriceSchema
>

type RefinablePrice = {
  amount: string | number
  gte?: string | number | null | undefined
  lte?: string | number | null | undefined
  lt?: number | null | undefined
  gt?: number | null | undefined
  eq?: number | null | undefined
}

const parseBound = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return undefined
  }

  return castNumber(value)
}

// Rules using eq/lt/gt operators can only be managed through the API, so we
// don't validate overlaps for them in the dashboard.
const hasCustomOperators = (price: RefinablePrice) =>
  price.eq != null || price.lt != null || price.gt != null

function refineDuplicates(
  data: {
    prices: RefinablePrice[]
  },
  ctx: z.RefinementCtx
) {
  const prices = data.prices

  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      const price1 = prices[i]
      const price2 = prices[j]

      if (hasCustomOperators(price1) || hasCustomOperators(price2)) {
        continue
      }

      const lower1 = parseBound(price1.gte)
      const upper1 = parseBound(price1.lte)
      const lower2 = parseBound(price2.gte)
      const upper2 = parseBound(price2.lte)

      // A rule without any bound is invalid on its own (handled by another
      // refinement), so skip the overlap comparison for it.
      if (
        (lower1 === undefined && upper1 === undefined) ||
        (lower2 === undefined && upper2 === undefined)
      ) {
        continue
      }

      const start1 = lower1 ?? Number.NEGATIVE_INFINITY
      const end1 = upper1 ?? Number.POSITIVE_INFINITY
      const start2 = lower2 ?? Number.NEGATIVE_INFINITY
      const end2 = upper2 ?? Number.POSITIVE_INFINITY

      // Two cart item total ranges conflict only when they share at least one
      // value. The price amount is intentionally not part of this check: the
      // same amount can legitimately apply to multiple non-overlapping
      // conditions.
      const overlaps = start1 <= end2 && start2 <= end1

      if (overlaps) {
        addOverlappingConditionError(ctx, j)
      }
    }
  }
}

export const CondtionalPriceRuleSchema = z
  .object({
    prices: z.array(ConditionalPriceSchema),
  })
  .superRefine(refineDuplicates)

export type CondtionalPriceRuleSchemaType = z.infer<
  typeof CondtionalPriceRuleSchema
>

export const UpdateConditionalPriceRuleSchema = z
  .object({
    prices: z.array(UpdateConditionalPriceSchema),
  })
  .superRefine(refineDuplicates)

export type UpdateConditionalPriceRuleSchemaType = z.infer<
  typeof UpdateConditionalPriceRuleSchema
>

const addOverlappingConditionError = (ctx: z.RefinementCtx, index: number) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: t(
      "stockLocations.shippingOptions.conditionalPrices.errors.overlappingConditions"
    ),
    path: ["prices", index, "gte"],
  })
}
