import { z } from "zod"

const PricingVariantPricesRecordSchema = z.record(z.number())

const PricingVariantsRecordSchema = z.record(
  z.object({
    currency_prices: PricingVariantPricesRecordSchema,
    region_prices: PricingVariantPricesRecordSchema,
  })
)

export type PricingVariantsRecordType = z.infer<
  typeof PricingVariantsRecordSchema
>

const PricingProductsRecordSchema = z.record(
  z.object({
    variants: PricingVariantsRecordSchema,
  })
)

export type PricingProductsRecordType = z.infer<
  typeof PricingProductsRecordSchema
>

export const PricingCreateSchema = z.object({
  type: z.enum(["sale", "override"]),
  title: z.string().min(1),
  description: z.string().min(1),
  starts_at: z.date().nullable(),
  ends_at: z.date().nullable(),
  product_ids: z.array(z.string()).min(1),
  products: PricingProductsRecordSchema,
})

export type PricingCreateSchemaType = z.infer<typeof PricingCreateSchema>
