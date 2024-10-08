import { z } from "zod"

export const CreateFulfillmentSchema = z.object({
  quantity: z.record(z.string(), z.number()),

  location_id: z.string(),
  shipping_option_id: z.string().optional(),
  send_notification: z.boolean().optional(),
})
