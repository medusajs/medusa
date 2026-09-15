import { t } from "i18next"
import { z } from "zod"
import { castNumber } from "../../../lib/cast-number"

export const ConditionalPriceSchema = z
  .object({
    amount: z.union([z.string(), z.number()]),
    gte: z.union([z.string(), z.number()]).nullish(),
    lte: z.union([z.string(), z.number()]).nullish(),
    weight_total_gte: z.union([z.string(), z.number()]).nullish(),
    weight_total_lte: z.union([z.string(), z.number()]).nullish(),
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
        (data.lte !== undefined && data.lte !== "") ||
        (data.weight_total_gte !== undefined &&
          data.weight_total_gte !== "") ||
        (data.weight_total_lte !== undefined &&
          data.weight_total_lte !== "")
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
  .refine(
    (data) => {
      if (
        data.weight_total_gte != null &&
        data.weight_total_gte !== "" &&
        data.weight_total_lte != null &&
        data.weight_total_lte !== ""
      ) {
        const gte = castNumber(data.weight_total_gte)
        const lte = castNumber(data.weight_total_lte)
        return gte <= lte
      }
      return true
    },
    {
      message: t(
        "stockLocations.shippingOptions.conditionalPrices.errors.weightMinGreaterThanMax"
      ),
      path: ["weight_total_gte"],
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
  weight_total_gte?: string | number | null | undefined
  weight_total_lte?: string | number | null | undefined
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
    prices: {
      amount: string | number
      gte?: string | number | null | undefined
      lte?: string | number | null | undefined
      weight_total_gte?: string | number | null | undefined
      weight_total_lte?: string | number | null | undefined
      lt?: number | null | undefined
      gt?: number | null | undefined
      eq?: number | null | undefined
    }[]
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

      const wlower1 = parseBound(price1.weight_total_gte)
      const wupper1 = parseBound(price1.weight_total_lte)
      const wlower2 = parseBound(price2.weight_total_gte)
      const wupper2 = parseBound(price2.weight_total_lte)

      if (
        (lower1 === undefined && upper1 === undefined &&
         wlower1 === undefined && wupper1 === undefined) ||
        (lower2 === undefined && upper2 === undefined &&
         wlower2 === undefined && wupper2 === undefined)
      ) {
        continue
      }

      // Check price range overlap (gte/lte)
      if (lower1 !== undefined || upper1 !== undefined ||
          lower2 !== undefined || upper2 !== undefined) {
        const start1 = lower1 ?? -Infinity
        const end1 = upper1 ?? Infinity
        const start2 = lower2 ?? -Infinity
        const end2 = upper2 ?? Infinity

        if (start1 <= end2 && start2 <= end1) {
          addOverlappingConditionError(ctx, j, "gte")
        }
      }

      // Check weight_total range overlap (weight_total_gte/weight_total_lte)
      if (wlower1 !== undefined || wupper1 !== undefined ||
          wlower2 !== undefined || wupper2 !== undefined) {
        const wstart1 = wlower1 ?? -Infinity
        const wend1 = wupper1 ?? Infinity
        const wstart2 = wlower2 ?? -Infinity
        const wend2 = wupper2 ?? Infinity

        if (wstart1 <= wend2 && wstart2 <= wend1) {
          addOverlappingConditionError(ctx, j, "weight_total_gte")
        }
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

const addOverlappingConditionError = (
  ctx: z.RefinementCtx,
  index: number,
  type:
    | "gte"
    | "lte"
    | "weight_total_gte"
    | "weight_total_lte"
    | "eq"
    | "lt"
    | "gt"
) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: t(
      "stockLocations.shippingOptions.conditionalPrices.errors.overlappingConditions"
    ),
    path: ["prices", index, type],
  })
}
