import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export const AdminGetOrdersOrderParams = createSelectParams().merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

export type AdminGetOrdersOrderParamsType = z.infer<
  typeof AdminGetOrdersOrderParams
>

/**
 * Parameters used to filter and configure the pagination of the retrieved order.
 */
export const AdminGetOrdersParams = createFindParams({
  limit: 15,
  offset: 0,
}).merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    order_id: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

export type AdminGetOrdersParamsType = z.infer<typeof AdminGetOrdersParams>

export const AdminPostOrderOrderEditsReqSchema = z.object({
  order_id: z.string(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminPostOrderOrderEditsReqSchemaType = z.infer<
  typeof AdminPostOrderOrderEditsReqSchema
>

export const AdminPostReceiveOrderEditsReqSchema = z.object({
  internal_note: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminPostReceiveOrderEditsReqSchemaType = z.infer<
  typeof AdminPostReceiveOrderEditsReqSchema
>

const ReceiveItemSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1),
  internal_note: z.string().optional(),
})
export const AdminPostReceiveOrderEditItemsReqSchema = z.object({
  items: z.array(ReceiveItemSchema),
})
export type AdminPostReceiveOrderEditItemsReqSchemaType = z.infer<
  typeof AdminPostReceiveOrderEditItemsReqSchema
>

export const AdminPostCancelOrderEditReqSchema = z.object({
  no_notification: z.boolean().optional(),
})
export type AdminPostCancelOrderEditReqSchemaType = z.infer<
  typeof AdminPostCancelOrderEditReqSchema
>

export const AdminPostOrderEditsRequestItemsReturnActionReqSchema = z.object({
  quantity: z.number().optional(),
  internal_note: z.string().nullish().optional(),
  reason_id: z.string().nullish().optional(),
  metadata: z.record(z.unknown()).nullish().optional(),
})

export type AdminPostOrderEditsRequestItemsReturnActionReqSchemaType = z.infer<
  typeof AdminPostOrderEditsRequestItemsReturnActionReqSchema
>

export const AdminPostOrderEditsShippingReqSchema = z.object({
  shipping_option_id: z.string(),
  custom_price: z.number().optional(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminPostOrderEditsShippingReqSchemaType = z.infer<
  typeof AdminPostOrderEditsShippingReqSchema
>

export const AdminPostOrderEditsShippingActionReqSchema = z.object({
  custom_price: z.number().optional(),
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
      unit_price: z.number().optional(),
      internal_note: z.string().optional(),
      allow_backorder: z.boolean().optional(),
      metadata: z.record(z.unknown()).optional(),
    })
  ),
})

export type AdminPostOrderEditsAddItemsReqSchemaType = z.infer<
  typeof AdminPostOrderEditsAddItemsReqSchema
>

export const AdminPostOrderEditsReturnRequestItemsReqSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
      description: z.string().optional(),
      internal_note: z.string().optional(),
      reason_id: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    })
  ),
})

export type AdminPostOrderEditsReturnRequestItemsReqSchemaType = z.infer<
  typeof AdminPostOrderEditsReturnRequestItemsReqSchema
>

export const AdminPostOrderEditsDismissItemsActionReqSchema = z.object({
  quantity: z.number().optional(),
  internal_note: z.string().nullish().optional(),
})

export type AdminPostOrderEditsDismissItemsActionReqSchemaType = z.infer<
  typeof AdminPostOrderEditsDismissItemsActionReqSchema
>

export const AdminPostOrderEditsConfirmRequestReqSchema = z.object({
  no_notification: z.boolean().optional(),
})

export type AdminPostOrderEditsConfirmRequestReqSchemaType = z.infer<
  typeof AdminPostOrderEditsConfirmRequestReqSchema
>

export const AdminPostExhangesItemsActionReqSchema = z.object({
  quantity: z.number().optional(),
  internal_note: z.string().nullish().optional(),
})

export type AdminPostExhangesItemsActionReqSchemaType = z.infer<
  typeof AdminPostExhangesItemsActionReqSchema
>
