import { z } from "zod"
import { ShippingOptionPriceType } from "../../../common/constants"

export type CreateShippingOptionSchema = z.infer<
  typeof CreateShippingOptionSchema
>

export const CreateShippingOptionDetailsSchema = z.object({
  name: z.string().min(1),
  price_type: z.nativeEnum(ShippingOptionPriceType),
  enabled_in_store: z.boolean(),
  shipping_profile_id: z.string().min(1),
  provider_id: z.string().min(1),
})

export const CreateShippingOptionSchema = z
  .object({
    region_prices: z.record(z.string(), z.string().optional()),
    currency_prices: z.record(z.string(), z.string().optional()),
  })
  .merge(CreateShippingOptionDetailsSchema)
