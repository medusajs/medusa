import { z } from "zod"
import { AddressPayload } from "../../utils/common-validators"
import { createSelectParams } from "../../utils/validators"

export const AdminFulfillmentParams = createSelectParams()

const AdminCreateFulfillmentItem = z.object({
  title: z.string(),
  sku: z.string(),
  quantity: z.number(),
  barcode: z.string(),
  line_item_id: z.string().nullish(),
  inventory_item_id: z.string().nullish(),
})

const AdminCreateFulfillmentLabel = z.object({
  tracking_number: z.string(),
  tracking_url: z.string(),
  label_url: z.string(),
})

export type AdminCancelFulfillmentType = z.infer<typeof AdminCancelFulfillment>
export const AdminCancelFulfillment = z.object({})

export type AdminCreateFulfillmentType = z.infer<typeof AdminCreateFulfillment>
// TODO: revisit the data shape this endpoint accepts
export const AdminCreateFulfillment = z.object({
  location_id: z.string(),
  provider_id: z.string(),
  delivery_address: AddressPayload,
  items: z.array(AdminCreateFulfillmentItem),
  labels: z.array(AdminCreateFulfillmentLabel),
  order: z.object({}),
  order_id: z.string(),
  shipping_option_id: z.string().nullish(),
  data: z.record(z.unknown()).nullish(),
  packed_at: z.coerce.date().nullish(),
  shipped_at: z.coerce.date().nullish(),
  delivered_at: z.coerce.date().nullish(),
  canceled_at: z.coerce.date().nullish(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminCreateShipmentType = z.infer<typeof AdminCreateShipment>
export const AdminCreateShipment = z.object({
  labels: z.array(AdminCreateFulfillmentLabel),
})
