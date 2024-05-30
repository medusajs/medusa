import { z } from "zod"
import { AddressPayload } from "../../utils/common-validators"
import { createSelectParams } from "../../utils/validators"

export type StoreGetPromotionType = z.infer<typeof StoreGetCartsCart>
export const StoreGetCartsCart = createSelectParams()

const ItemSchema = z.object({
  variant_id: z.string(),
  quantity: z.number(),
})

export type StoreCreateCartType = z.infer<typeof StoreCreateCart>
export const StoreCreateCart = z
  .object({
    region_id: z.string().optional().nullable(),
    shipping_address: z.union([AddressPayload, z.string()]).optional(),
    billing_address: z.union([AddressPayload, z.string()]).optional(),
    email: z.string().email().optional().nullable(),
    currency_code: z.string().optional(),
    items: z.array(ItemSchema).optional(),
    sales_channel_id: z.string().optional().nullable(),
    metadata: z.record(z.unknown()).optional().nullable(),
  })
  .strict()

export type StoreAddCartPromotionsType = z.infer<typeof StoreAddCartPromotions>
export const StoreAddCartPromotions = z
  .object({
    promo_codes: z.array(z.string()),
  })
  .strict()

export type StoreRemoveCartPromotionsType = z.infer<
  typeof StoreRemoveCartPromotions
>
export const StoreRemoveCartPromotions = z
  .object({
    promo_codes: z.array(z.string()),
  })
  .strict()

export type StoreUpdateCartType = z.infer<typeof StoreUpdateCart>
export const StoreUpdateCart = z
  .object({
    region_id: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    billing_address: z.union([AddressPayload, z.string()]).optional(),
    shipping_address: z.union([AddressPayload, z.string()]).optional(),
    sales_channel_id: z.string().optional().nullable(),
    metadata: z.record(z.unknown()).optional().nullable(),
    promo_codes: z.array(z.string()).optional(),
  })
  .strict()

export type StoreCalculateCartTaxesType = z.infer<
  typeof StoreCalculateCartTaxes
>
export const StoreCalculateCartTaxes = createSelectParams()

export type StoreAddCartLineItemType = z.infer<typeof StoreAddCartLineItem>
export const StoreAddCartLineItem = z.object({
  variant_id: z.string(),
  quantity: z.number(),
  metadata: z.record(z.unknown()).optional(),
})

export type StoreUpdateCartLineItemType = z.infer<
  typeof StoreUpdateCartLineItem
>
export const StoreUpdateCartLineItem = z.object({
  quantity: z.number(),
  metadata: z.record(z.unknown()).optional(),
})

export type StoreAddCartShippingMethodsType = z.infer<
  typeof StoreAddCartShippingMethods
>
export const StoreAddCartShippingMethods = z
  .object({
    option_id: z.string(),
    data: z.record(z.unknown()).optional(),
  })
  .strict()
