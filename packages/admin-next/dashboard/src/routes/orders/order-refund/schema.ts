import { z } from "zod"

export const CreateRefundSchema = z.object({
  amount: z.number().min(0),
  reason: z.string(),
  note: z.string().optional(),
  notification_enabled: z.boolean().optional(),
})
