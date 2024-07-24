import { z, ZodObject } from "zod"
import { AddressPayload, BigNumberInput } from "../../utils/common-validators"
import { createFindParams, createSelectParams } from "../../utils/validators"

export type AdminGetOrderParamsType = z.infer<typeof AdminGetOrderParams>
export const AdminGetOrderParams = createSelectParams()

export type AdminGetOrdersParamsType = z.infer<typeof AdminGetOrdersParams>
export const AdminGetOrdersParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    name: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z.lazy(() => AdminGetOrdersParams.array()).optional(),
    $or: z.lazy(() => AdminGetOrdersParams.array()).optional(),
  })
)

enum Status {
  completed = "completed",
}

const ShippingMethod = z.object({
  shipping_method_id: z.string().nullish(),
  order_id: z.string().nullish(),
  name: z.string(),
  option_id: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
  amount: BigNumberInput,
})

const Item = z
  .object({
    title: z.string().nullish(),
    sku: z.string().nullish(),
    barcode: z.string().nullish(),
    variant_id: z.string().nullish(),
    unit_price: BigNumberInput.nullish(),
    quantity: z.number(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .refine((data) => {
    if (!data.variant_id) {
      return data.title && (data.sku || data.barcode)
    }

    return true
  })

export type AdminCreateDraftOrderType = z.infer<typeof _AdminCreateDraftOrder>
const _AdminCreateDraftOrder = z
  .object({
    status: z.nativeEnum(Status).optional(),
    sales_channel_id: z.string().nullish(),
    email: z.string().nullish(),
    customer_id: z.string().nullish(),
    billing_address: AddressPayload.optional(),
    shipping_address: AddressPayload.optional(),
    items: z.array(Item).optional(),
    region_id: z.string(),
    promo_codes: z.array(z.string()).optional(),
    currency_code: z.string().nullish(),
    no_notification_order: z.boolean().optional(),
    shipping_methods: z.array(ShippingMethod),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()

export const AdminCreateDraftOrder = (customSchema?: ZodObject<any, any>) => {
  const schema = customSchema
    ? _AdminCreateDraftOrder.merge(customSchema)
    : _AdminCreateDraftOrder

  return schema.refine(
    (data) => {
      if (!data.email && !data.customer_id) {
        return false
      }

      return true
    },
    { message: "Either email or customer_id must be provided" }
  )
}
