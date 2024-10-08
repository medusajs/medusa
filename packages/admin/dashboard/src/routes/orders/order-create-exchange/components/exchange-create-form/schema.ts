import { z } from "zod"

export const ExchangeCreateSchema = z.object({
  inbound_items: z.array(
    z.object({
      item_id: z.string(),
      quantity: z.number(),
      reason_id: z.string().nullish(),
      note: z.string().nullish(),
    })
  ),
  outbound_items: z.array(
    z.object({
      item_id: z.string(),
      quantity: z.number(),
    })
  ),
  location_id: z.string().optional(),
  inbound_option_id: z.string().nullish(),
  outbound_option_id: z.string().nullish(),
  send_notification: z.boolean().optional(),
})

export type CreateExchangeSchemaType = z.infer<typeof ExchangeCreateSchema>
