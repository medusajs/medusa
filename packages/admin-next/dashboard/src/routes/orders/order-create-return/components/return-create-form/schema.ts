import { z } from "zod"

export const ReturnCreateSchema = z.object({
  items: z.array(
    z.object({
      item_id: z.string(),
      quantity: z.number(),
    })
  ),
  location_id: z.string().optional(),
  reason_id: z.string(),
  option_id: z.string(),
  note: z.string().optional(),
  // TODO: MISSING IN AS AN API PARAM
  send_notification: z.boolean().optional(),
  // TODO: implement this
  receive_now: z.boolean().optional(),
})

export type ReturnCreateSchemaType = z.infer<typeof ReturnCreateSchema>
