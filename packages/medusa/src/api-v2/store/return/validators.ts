import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

export type ReturnParamsType = z.infer<typeof ReturnParams>
export const ReturnParams = createSelectParams()

export type ReturnsParamsType = z.infer<typeof ReturnsParams>
export const ReturnsParams = createFindParams().merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    order_id: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z.lazy(() => ReturnsParams.array()).optional(),
    $or: z.lazy(() => ReturnsParams.array()).optional(),
  })
)

const ReturnShippingSchema = z.object({
  option_id: z.string(),
})

const ItemSchema = z.object({
  item_id: z.string(),
  quantity: z.number().min(1),
  reason_id: z.string().optional(),
  note: z.string().optional(),
})

export const StorePostReturnsReqSchema = z.object({
  order_id: z.string(),
  items: z.array(ItemSchema),
  return_shipping: ReturnShippingSchema.optional(),
})
