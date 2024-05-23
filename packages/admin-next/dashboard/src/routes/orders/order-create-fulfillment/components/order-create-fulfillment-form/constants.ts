import { z } from "zod"

export const CreateFulfillmentSchema = z.object({
  quantity: z.record(z.string(), z.number()),

  location_id: z.string(),
  send_notification: z.boolean().optional(),
})
