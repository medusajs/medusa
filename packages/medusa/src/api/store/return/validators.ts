import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export type ReturnParamsType = z.infer<typeof ReturnParams>
export const ReturnParams = createSelectParams()

export const ReturnsParamsFields = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  order_id: z.union([z.string(), z.array(z.string())]).optional(),
})

export type ReturnsParamsType = z.infer<typeof ReturnsParams>
export const ReturnsParams = createFindParams()
  .merge(ReturnsParamsFields)
  .merge(applyAndAndOrOperators(ReturnsParamsFields))

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

export const StorePostReturnsReqSchema = z.object({
  order_id: z.string(),
  items: z.array(ItemSchema),
  return_shipping: ReturnShippingSchema,
  note: z.string().nullish(),
  receive_now: z.boolean().optional(),
  location_id: z.string().nullish(),
})
export type StorePostReturnsReqSchemaType = z.infer<
  typeof StorePostReturnsReqSchema
>
