import { z } from "zod"

export const OrderEditCreateSchema = z.object({
  note: z.string().optional(),
  send_notification: z.boolean().optional(),
})

export type CreateOrderEditSchemaType = z.infer<typeof OrderEditCreateSchema>
