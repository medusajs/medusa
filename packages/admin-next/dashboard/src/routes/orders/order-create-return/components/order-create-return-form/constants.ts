import { z } from "zod"

export const CreateReturnSchema = z.object({
  quantity: z.record(z.string(), z.number()),
  reason: z.record(z.string(), z.string().optional()),
  note: z.record(z.string(), z.string().optional()),
  location: z.string(),
  shipping: z.string(),
  send_notification: z.boolean().optional(),

  enable_custom_refund: z.boolean().optional(),
  enable_custom_shipping_price: z.boolean().optional(),

  custom_refund: z.union([z.string(), z.number()]).optional(),
  custom_shipping_price: z.union([z.string(), z.number()]).optional(),
})
