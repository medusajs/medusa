import { ClaimReason, ClaimType } from "@medusajs/utils"
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

export const AdminPostOrderClaimsReqSchema = z.object({
  type: z.nativeEnum(ClaimType),
  order_id: z.string(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminPostOrderClaimsReqSchemaType = z.infer<
  typeof AdminPostOrderClaimsReqSchema
>

export const AdminPostOrderExchangesReqSchema = z.object({
  order_id: z.string(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminPostOrderExchangesReqSchemaType = z.infer<
  typeof AdminPostOrderExchangesReqSchema
>

export const AdminPostReceiveClaimsReqSchema = z.object({
  internal_note: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminPostReceiveClaimsReqSchemaType = z.infer<
  typeof AdminPostReceiveClaimsReqSchema
>

const ReceiveItemSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1),
  internal_note: z.string().optional(),
})
export const AdminPostReceiveClaimItemsReqSchema = z.object({
  items: z.array(ReceiveItemSchema),
})
export type AdminPostReceiveClaimItemsReqSchemaType = z.infer<
  typeof AdminPostReceiveClaimItemsReqSchema
>

export const AdminPostCancelClaimReqSchema = z.object({
  return_id: z.string(),
  no_notification: z.boolean().optional(),
  internal_note: z.string().nullish(),
})
export type AdminPostCancelClaimReqSchemaType = z.infer<
  typeof AdminPostCancelClaimReqSchema
>

export const AdminPostClaimsShippingReqSchema = z.object({
  shipping_option_id: z.string(),
  custom_price: z.number().optional(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminPostClaimsShippingReqSchemaType = z.infer<
  typeof AdminPostClaimsShippingReqSchema
>

export const AdminPostClaimsShippingActionReqSchema = z.object({
  custom_price: z.number().optional(),
  internal_note: z.string().nullish().optional(),
  metadata: z.record(z.unknown()).nullish().optional(),
})

export type AdminPostClaimsShippingActionReqSchemaType = z.infer<
  typeof AdminPostClaimsShippingActionReqSchema
>

export const AdminPostClaimsAddItemsReqSchema = z.object({
  items: z.array(
    z.object({
      variant_id: z.string(),
      quantity: z.number(),
      unit_price: z.number().optional(),
      internal_note: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    })
  ),
})

export type AdminPostClaimsAddItemsReqSchemaType = z.infer<
  typeof AdminPostClaimsAddItemsReqSchema
>

export const AdminPostClaimsRequestReturnItemsReqSchema = z.object({
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

export type AdminPostClaimsRequestReturnItemsReqSchemaType = z.infer<
  typeof AdminPostClaimsRequestReturnItemsReqSchema
>

export const AdminPostClaimItemsReqSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
      reason: z.nativeEnum(ClaimReason).optional(),
      description: z.string().optional(),
      internal_note: z.string().optional(),
    })
  ),
})

export type AdminPostClaimItemsReqSchemaType = z.infer<
  typeof AdminPostClaimItemsReqSchema
>

export const AdminPostClaimsRequestItemsActionReqSchema = z.object({
  quantity: z.number().optional(),
  internal_note: z.string().nullish().optional(),
  reason_id: z.string().nullish().optional(),
  metadata: z.record(z.unknown()).nullish().optional(),
})

export type AdminPostClaimsRequestItemsActionReqSchemaType = z.infer<
  typeof AdminPostClaimsRequestItemsActionReqSchema
>

export const AdminPostClaimsItemsActionReqSchema = z.object({
  quantity: z.number().optional(),
  reason: z.nativeEnum(ClaimReason).nullish().optional(),
  internal_note: z.string().nullish().optional(),
})

export type AdminPostClaimsItemsActionReqSchemaType = z.infer<
  typeof AdminPostClaimsItemsActionReqSchema
>

export const AdminPostClaimsDismissItemsActionReqSchema = z.object({
  quantity: z.number().optional(),
  internal_note: z.string().nullish().optional(),
})

export type AdminPostClaimsDismissItemsActionReqSchemaType = z.infer<
  typeof AdminPostClaimsDismissItemsActionReqSchema
>

export const AdminPostClaimsConfirmRequestReqSchema = z.object({
  no_notification: z.boolean().optional(),
})

export type AdminPostClaimsConfirmRequestReqSchemaType = z.infer<
  typeof AdminPostClaimsConfirmRequestReqSchema
>
