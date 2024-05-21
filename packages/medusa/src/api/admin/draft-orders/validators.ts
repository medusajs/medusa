import { createFindParams, createSelectParams } from "../../utils/validators"
import { AddressPayload, BigNumberInput } from "../../utils/common-validators"
import { z } from "zod"

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
  shipping_method_id: z.string().optional(),
  order_id: z.string().optional(),
  name: z.string(),
  option_id: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
  amount: BigNumberInput,
})

const Item = z
  .object({
    title: z.string().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    variant_id: z.string().optional(),
    unit_price: BigNumberInput.optional(),
    quantity: z.number(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .refine((data) => {
    if (!data.variant_id) {
      return data.title && (data.sku || data.barcode)
    }

    return true
  })

export type AdminCreateDraftOrderType = z.infer<typeof AdminCreateDraftOrder>
export const AdminCreateDraftOrder = z
  .object({
    status: z.nativeEnum(Status).optional(),
    sales_channel_id: z.string().optional(),
    email: z.string().optional(),
    customer_id: z.string().optional(),
    billing_address: AddressPayload.optional(),
    shipping_address: AddressPayload.optional(),
    items: z.array(Item).optional(),
    region_id: z.string(),
    promo_codes: z.array(z.string()).optional(),
    currency_code: z.string().optional(),
    no_notification_order: z.boolean().optional(),
    shipping_methods: z.array(ShippingMethod),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (!data.email && !data.customer_id) {
        return false
      }

      return true
    },
    { message: "Either email or customer_id must be provided" }
  )
