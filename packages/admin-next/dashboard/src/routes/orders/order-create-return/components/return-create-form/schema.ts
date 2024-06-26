import { z } from "zod"

export const ReturnCreateSchema = z.object({
  items: z.array(
    z.object({
      item_id: z.string(),
      quantity: z.number(),
    })
  ),
})

export type ReturnCreateSchemaType = z.infer<typeof ReturnCreateSchema>
