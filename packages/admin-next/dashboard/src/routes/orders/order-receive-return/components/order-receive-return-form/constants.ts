import { z } from "zod"

export const ReceiveReturnSchema = z.object({
  quantity: z.record(z.string(), z.number().or(z.string())),
  send_notification: z.boolean().optional(),
})
