import { z } from "zod"
import { AddressPayload } from "../../utils/common-validators"
import { createSelectParams } from "../../utils/validators"

export const AdminFulfillmentParams = createSelectParams()

const AdminCreateFulfillmentItem = z.object({
  title: z.string(),
  sku: z.string(),
  quantity: z.number(),
  barcode: z.string(),
  line_item_id: z.string().optional(),
  inventory_item_id: z.string().optional(),
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
  metadata: z.record(z.unknown()).optional().nullable(),
})

export type AdminCreateShipmentType = z.infer<typeof AdminCreateShipment>
export const AdminCreateShipment = z.object({
  labels: z.array(AdminCreateFulfillmentLabel),
})
