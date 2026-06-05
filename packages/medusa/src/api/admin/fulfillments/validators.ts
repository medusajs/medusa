import { z } from "@medusajs/framework/zod"
import { AddressPayload, safeHttpUrl } from "../../utils/common-validators"
import { createSelectParams } from "../../utils/validators"

/**
 * Parameters for admin fulfillment queries.
 */
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
  tracking_url: safeHttpUrl,
  label_url: safeHttpUrl,
})

/**
 * Type for creating an admin fulfillment.
 */
export type AdminCreateFulfillmentType = z.infer<typeof AdminCreateFulfillment>
/**
 * Schema for creating an admin fulfillment.
 * 
 * @remarks TODO: revisit the data shape this endpoint accepts
 */
// TODO: revisit the data shape this endpoint accepts
export const AdminCreateFulfillment = z.object({
  location_id: z.string(),
  provider_id: z.string(),
  delivery_address: AddressPayload,
  items: z.array(AdminCreateFulfillmentItem),
  labels: z.array(AdminCreateFulfillmentLabel),
  order_id: z.string(),
  shipping_option_id: z.string().nullish(),
  data: z.record(z.string(), z.unknown()).nullable(),
  packed_at: z.coerce.date().nullish(),
  shipped_at: z.coerce.date().nullish(),
  delivered_at: z.coerce.date().nullish(),
  canceled_at: z.coerce.date().nullish(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
})

/**
 * Type for creating an admin shipment.
 */
export type AdminCreateShipmentType = z.infer<typeof AdminCreateShipment>
/**
 * Schema for creating an admin shipment.
 */
export const AdminCreateShipment = z.object({
  labels: z.array(AdminCreateFulfillmentLabel),
})
