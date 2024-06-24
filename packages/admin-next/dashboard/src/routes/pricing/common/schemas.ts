import { z } from "zod"

const PricingVariantPricesRecordSchema = z.record(
  z
    .object({
      amount: z.string().optional(),
      id: z.string().nullable().optional(),
    })
    .optional()
)

const PricingVariantsRecordSchema = z.record(
  z.object({
    currency_prices: PricingVariantPricesRecordSchema.optional(),
    region_prices: PricingVariantPricesRecordSchema.optional(),
  })
)

export type PricingVariantsRecordType = z.infer<
  typeof PricingVariantsRecordSchema
>

export const PricingProductsRecordSchema = z.record(
  z.object({
    variants: PricingVariantsRecordSchema,
  })
)

export type PricingProductsRecordType = z.infer<
  typeof PricingProductsRecordSchema
>
