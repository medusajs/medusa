import { z } from "zod"
import { createSelectParams } from "../../utils/validators"

export const AdminFulfillmentParams = createSelectParams()

export type AdminCancelFulfillmentType = z.infer<typeof AdminCancelFulfillment>
export const AdminCancelFulfillment = z.object({})

export type AdminCreateFulfillmentType = z.infer<typeof AdminCreateFulfillment>
export const AdminCreateFulfillment = z.object({
  location_id: z.string(),
  provider_id: z.string(),
  delivery_address: z.object({
    company: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    address_1: z.string().optional(),
    address_2: z.string().optional(),
    city: z.string().optional(),
    country_code: z.string().optional(),
    province: z.string().optional(),
    postal_code: z.string().optional(),
    phone: z.string().optional(),
    metadata: z.record(z.unknown()).optional().nullable(),
  }),
  items: z.array(
    z.object({
      title: z.string(),
      sku: z.string(),
      quantity: z.number(),
      barcode: z.string(),
      line_item_id: z.string().optional(),
      inventory_item_id: z.string().optional(),
    })
  ),
  labels: z.array(
    z.object({
      tracking_number: z.string(),
      tracking_url: z.string(),
      label_url: z.string(),
    })
  ),
  order: z.object({}),
  metadata: z.record(z.unknown()).optional().nullable(),
})

export type AdminUpdateFulfillmentType = z.infer<typeof AdminUpdateFulfillment>
export const AdminUpdateFulfillment = z.object({
  packed_at: z.coerce.date().optional(),
  shipped_at: z.coerce.date().optional(),
  delivered_at: z.coerce.date().optional(),
  location_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional().nullable(),
  data: z.record(z.unknown()).optional().nullable(),
})
