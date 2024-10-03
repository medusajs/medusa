import { z } from "zod"

const PriceListCustomerGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export type PriceListCustomerGroup = z.infer<
  typeof PriceListCustomerGroupSchema
>

export const PriceListRulesSchema = z.object({
  customer_group_id: z.array(PriceListCustomerGroupSchema).nullish(),
})

const PriceListCreateCurrencyPriceSchema = z.object({
  amount: z.string().or(z.number()).optional(),
})

export type PriceListCreateCurrencyPrice = z.infer<
  typeof PriceListCreateCurrencyPriceSchema
>

const PriceListCreateRegionPriceSchema = z.object({
  amount: z.string().or(z.number()).optional(),
})

export type PriceListCreateRegionPriceSchema = z.infer<
  typeof PriceListCreateRegionPriceSchema
>

const PriceListCreateProductVariantSchema = z.object({
  currency_prices: z.record(PriceListCreateCurrencyPriceSchema.optional()),
  region_prices: z.record(PriceListCreateRegionPriceSchema.optional()),
})

export type PriceListCreateProductVariantSchema = z.infer<
  typeof PriceListCreateProductVariantSchema
>

const PriceListCreateProductVariantsSchema = z.record(
  PriceListCreateProductVariantSchema
)

export type PriceListCreateProductVariantsSchema = z.infer<
  typeof PriceListCreateProductVariantsSchema
>

export const PriceListCreateProductsSchema = z.record(
  z.object({
    variants: PriceListCreateProductVariantsSchema,
  })
)

export type PriceListCreateProductsSchema = z.infer<
  typeof PriceListCreateProductsSchema
>

export const PriceListUpdateCurrencyPriceSchema = z.object({
  amount: z.string().or(z.number()).optional(),
  id: z.string().nullish(),
})

export type PriceListUpdateCurrencyPrice = z.infer<
  typeof PriceListUpdateCurrencyPriceSchema
>

export const PriceListUpdateRegionPriceSchema = z.object({
  amount: z.string().or(z.number()).optional(),
  id: z.string().nullish(),
})

export type PriceListUpdateRegionPrice = z.infer<
  typeof PriceListUpdateRegionPriceSchema
>

export const PriceListUpdateProductVariantsSchema = z.record(
  z.object({
    currency_prices: z.record(PriceListUpdateCurrencyPriceSchema.optional()),
    region_prices: z.record(PriceListUpdateRegionPriceSchema.optional()),
  })
)

export type PriceListUpdateProductVariantsSchema = z.infer<
  typeof PriceListUpdateProductVariantsSchema
>

export const PriceListUpdateProductsSchema = z.record(
  z.object({
    variants: PriceListUpdateProductVariantsSchema,
  })
)

export type PriceListUpdateProductsSchema = z.infer<
  typeof PriceListUpdateProductsSchema
>
