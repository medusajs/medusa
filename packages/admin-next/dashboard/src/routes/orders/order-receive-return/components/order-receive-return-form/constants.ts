import { z } from "zod"

export const ReceiveReturnSchema = z.object({
  location_id: z.string(),
  quantity: z.record(z.string(), z.number().or(z.string())),
})
