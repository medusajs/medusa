import { z } from "zod"

export const OrderEditCreateSchema = z.object({
  items: z.array(
    z.object({
      item_id: z.string(),
      quantity: z.number(),
      reason_id: z.string().nullish(),
      note: z.string().nullish(),
    })
  ),
  note: z.string().optional(),
  send_notification: z.boolean().optional(),
})

export type CreateOrderEditSchemaType = z.infer<typeof OrderEditCreateSchema>
