import { z } from "zod"

export const AllocateItemsSchema = z.object({
  location_id: z.string(),
})
