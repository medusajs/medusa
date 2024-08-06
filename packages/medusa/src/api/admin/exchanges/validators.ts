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

export const AdminPostOrderExchangesReqSchema = z.object({
  order_id: z.string(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminPostOrderExchangesReqSchemaType = z.infer<
  typeof AdminPostOrderExchangesReqSchema
>

export const AdminPostReceiveExchangesReqSchema = z.object({
  internal_note: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminPostReceiveExchangesReqSchemaType = z.infer<
  typeof AdminPostReceiveExchangesReqSchema
>

const ReceiveItemSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1),
  internal_note: z.string().optional(),
})
export const AdminPostReceiveExchangeItemsReqSchema = z.object({
  items: z.array(ReceiveItemSchema),
})
export type AdminPostReceiveExchangeItemsReqSchemaType = z.infer<
  typeof AdminPostReceiveExchangeItemsReqSchema
>

export const AdminPostCancelExchangeReqSchema = z.object({
  no_notification: z.boolean().optional(),
})
export type AdminPostCancelExchangeReqSchemaType = z.infer<
  typeof AdminPostCancelExchangeReqSchema
>

export const AdminPostExchangesRequestItemsReturnActionReqSchema = z.object({
  quantity: z.number().optional(),
  internal_note: z.string().nullish().optional(),
  reason_id: z.string().nullish().optional(),
  metadata: z.record(z.unknown()).nullish().optional(),
})

export type AdminPostExchangesRequestItemsReturnActionReqSchemaType = z.infer<
  typeof AdminPostExchangesRequestItemsReturnActionReqSchema
>

export const AdminPostExchangesShippingReqSchema = z.object({
  shipping_option_id: z.string(),
  custom_price: z.number().optional(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminPostExchangesShippingReqSchemaType = z.infer<
  typeof AdminPostExchangesShippingReqSchema
>

export const AdminPostExchangesShippingActionReqSchema = z.object({
  custom_price: z.number().optional(),
  internal_note: z.string().nullish().optional(),
  metadata: z.record(z.unknown()).nullish().optional(),
})

export type AdminPostExchangesShippingActionReqSchemaType = z.infer<
  typeof AdminPostExchangesShippingActionReqSchema
>

export const AdminPostExchangesAddItemsReqSchema = z.object({
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

export type AdminPostExchangesAddItemsReqSchemaType = z.infer<
  typeof AdminPostExchangesAddItemsReqSchema
>

export const AdminPostExchangesReturnRequestItemsReqSchema = z.object({
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

export type AdminPostExchangesReturnRequestItemsReqSchemaType = z.infer<
  typeof AdminPostExchangesReturnRequestItemsReqSchema
>

export const AdminPostExchangesDismissItemsActionReqSchema = z.object({
  quantity: z.number().optional(),
  internal_note: z.string().nullish().optional(),
})

export type AdminPostExchangesDismissItemsActionReqSchemaType = z.infer<
  typeof AdminPostExchangesDismissItemsActionReqSchema
>

export const AdminPostExchangesConfirmRequestReqSchema = z.object({
  no_notification: z.boolean().optional(),
})

export type AdminPostExchangesConfirmRequestReqSchemaType = z.infer<
  typeof AdminPostExchangesConfirmRequestReqSchema
>

export const AdminPostExhangesItemsActionReqSchema = z.object({
  quantity: z.number().optional(),
  internal_note: z.string().nullish().optional(),
})

export type AdminPostExhangesItemsActionReqSchemaType = z.infer<
  typeof AdminPostExhangesItemsActionReqSchema
>
