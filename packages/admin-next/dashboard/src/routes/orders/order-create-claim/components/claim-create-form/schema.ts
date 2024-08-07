import { z } from "zod"

export const ClaimCreateSchema = z.object({
  inbound_items: z.array(
    z.object({
      item_id: z.string(),
      quantity: z.number(),
      reason_id: z.string().nullish(),
      note: z.string().nullish(),
    })
  ),
  // TODO: Bring back when introducing outbound items
  // outbound_items: z.array(
  //   z.object({
  //     item_id: z.string(), // TODO: variant id?
  //     quantity: z.number(),
  //   })
  // ),
  location_id: z.string().optional(),
  inbound_option_id: z.string().nullish(),
  send_notification: z.boolean().optional(),
})

export type ReturnCreateSchemaType = z.infer<typeof ClaimCreateSchema>
