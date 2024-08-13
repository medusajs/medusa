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
export const AdminPostOrderEditsItemsActionReqSchema = z.object({
  quantity: z.number().optional(),
  internal_note: z.string().nullish().optional(),
})

export type AdminPostOrderEditsItemsActionReqSchemaType = z.infer<
  typeof AdminPostOrderEditsItemsActionReqSchema
>
