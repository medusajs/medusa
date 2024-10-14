import { z } from "zod"

export const AdminPostOrderEditsReqSchema = z.object({
  order_id: z.string(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminPostOrderEditsReqSchemaType = z.infer<
  typeof AdminPostOrderEditsReqSchema
>

export const AdminPostOrderEditsShippingReqSchema = z.object({
  shipping_option_id: z.string(),
  custom_amount: z.number().optional(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminPostOrderEditsShippingReqSchemaType = z.infer<
  typeof AdminPostOrderEditsShippingReqSchema
>

export const AdminPostOrderEditsShippingActionReqSchema = z.object({
  custom_amount: z.number().nullish().optional(),
  internal_note: z.string().nullish().optional(),
  metadata: z.record(z.unknown()).nullish().optional(),
})

export type AdminPostOrderEditsShippingActionReqSchemaType = z.infer<
  typeof AdminPostOrderEditsShippingActionReqSchema
>

export const AdminPostOrderEditsAddItemsReqSchema = z.object({
  items: z.array(
    z.object({
      variant_id: z.string(),
      quantity: z.number(),
      unit_price: z.number().nullish(),
      compare_at_unit_price: z.number().nullish(),
      internal_note: z.string().nullish(),
      allow_backorder: z.boolean().optional(),
      metadata: z.record(z.unknown()).optional(),
    })
  ),
})

export type AdminPostOrderEditsAddItemsReqSchemaType = z.infer<
  typeof AdminPostOrderEditsAddItemsReqSchema
>

export const AdminPostOrderEditsItemsActionReqSchema = z.object({
  quantity: z.number().optional(),
  unit_price: z.number().nullish(),
  compare_at_unit_price: z.number().nullish(),
  internal_note: z.string().nullish().optional(),
})

export type AdminPostOrderEditsItemsActionReqSchemaType = z.infer<
  typeof AdminPostOrderEditsItemsActionReqSchema
>

export const AdminPostOrderEditsUpdateItemQuantityReqSchema = z.object({
  quantity: z.number(),
  unit_price: z.number().nullish(),
  compare_at_unit_price: z.number().nullish(),
  internal_note: z.string().nullish().optional(),
})

export type AdminPostOrderEditsUpdateItemQuantityReqSchemaType = z.infer<
  typeof AdminPostOrderEditsUpdateItemQuantityReqSchema
>
