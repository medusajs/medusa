import { z } from "zod"
import { AddressPayload } from "../../utils/common-validators"
import { createSelectParams, WithAdditionalData } from "../../utils/validators"

export type StoreGetPromotionType = z.infer<typeof StoreGetCartsCart>
export const StoreGetCartsCart = createSelectParams()

const ItemSchema = z.object({
  variant_id: z.string(),
  quantity: z.number(),
  metadata: z.record(z.unknown()).nullish(),
})

export type StoreCreateCartType = z.infer<typeof CreateCart>
export const CreateCart = z
  .object({
    region_id: z.string().nullish(),
    shipping_address: z.union([AddressPayload, z.string()]).optional(),
    billing_address: z.union([AddressPayload, z.string()]).optional(),
    email: z.string().email().nullish(),
    currency_code: z.string().nullish(),
    items: z.array(ItemSchema).optional(),
    sales_channel_id: z.string().nullish(),
    promo_codes: z.array(z.string()).optional(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()
export const StoreCreateCart = WithAdditionalData(CreateCart)

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

export type StoreUpdateCartType = z.infer<typeof UpdateCart>
export const UpdateCart = z
  .object({
    region_id: z.string().optional(),
    email: z.string().email().nullish(),
    billing_address: z.union([AddressPayload, z.string()]).optional(),
    shipping_address: z.union([AddressPayload, z.string()]).optional(),
    sales_channel_id: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
    promo_codes: z.array(z.string()).optional(),
  })
  .strict()
export const StoreUpdateCart = WithAdditionalData(UpdateCart)

export type StoreCalculateCartTaxesType = z.infer<
  typeof StoreCalculateCartTaxes
>
export const StoreCalculateCartTaxes = createSelectParams()

export type StoreAddCartLineItemType = z.infer<typeof StoreAddCartLineItem>
export const StoreAddCartLineItem = z.object({
  variant_id: z.string(),
  quantity: z.number(),
  metadata: z.record(z.unknown()).nullish(),
})

export type StoreUpdateCartLineItemType = z.infer<
  typeof StoreUpdateCartLineItem
>
export const StoreUpdateCartLineItem = z.object({
  quantity: z.number(),
  metadata: z.record(z.unknown()).nullish(),
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

export type StoreCreateCartPaymentCollectionType = z.infer<
  typeof StoreCreateCartPaymentCollection
>
export const StoreCreateCartPaymentCollection = z.object({}).strict()
