import { z } from "zod"

export const ReturnCreateSchema = z.object({
  items: z.array(
    z.object({
      item_id: z.string(),
      quantity: z.number(),
      reason_id: z.string().optional().nullable(),
      note: z.string().optional().nullable(),
    })
  ),
  location_id: z.string().optional(),
  option_id: z.string(),
  send_notification: z.boolean().optional(),
  // TODO: implement this
  receive_now: z.boolean().optional(),
})

export type ReturnCreateSchemaType = z.infer<typeof ReturnCreateSchema>
