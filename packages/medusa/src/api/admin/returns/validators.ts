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
    status: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

export type AdminGetOrdersParamsType = z.infer<typeof AdminGetOrdersParams>

const ReturnShippingSchema = z.object({
  option_id: z.string(),
  price: z.number().optional(),
})

const ItemSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1),
  reason_id: z.string().nullish(),
  note: z.string().nullish(),
})

export const AdminPostReturnsReqSchema = z.object({
  order_id: z.string(),
  items: z.array(ItemSchema),
  return_shipping: ReturnShippingSchema,
  note: z.string().nullish(),
  receive_now: z.boolean().optional(),
  refund_amount: z.number().optional(),
  location_id: z.string().nullish(),
})
export type AdminPostReturnsReqSchemaType = z.infer<
  typeof AdminPostReturnsReqSchema
>
