import { z } from "zod"

const CreatePriceListPriceSchema = z.object({
  amount: z.string().optional(),
  id: z.string().nullish(),
})

export type CreatePriceListPrice = z.infer<typeof CreatePriceListPriceSchema>

const PricingVariantPricesRecordSchema = z.record(
  CreatePriceListPriceSchema.optional()
)

const PricingVariantsRecordSchema = z.record(
  z.object({
    currency_prices: PricingVariantPricesRecordSchema.optional(),
    region_prices: PricingVariantPricesRecordSchema.optional(),
  })
)

export type PricingVariantsRecord = z.infer<typeof PricingVariantsRecordSchema>

export const PricingProductsRecordSchema = z.record(
  z.object({
    variants: PricingVariantsRecordSchema,
  })
)

export type PricingProductsRecord = z.infer<typeof PricingProductsRecordSchema>
