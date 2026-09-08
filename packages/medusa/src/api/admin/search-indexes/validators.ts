import { z } from "@medusajs/framework/zod"

export type AdminReindexSearchIndexType = z.infer<
  typeof AdminReindexSearchIndex
>
export const AdminReindexSearchIndex = z
  .object({
    // `offset: true` so a client that sends its own zone ("+02:00") is accepted
    // rather than being forced to convert to UTC first.
    since: z.iso.datetime({ offset: true }).optional(),
    filters: z.record(z.string(), z.unknown()).optional(),
    strategy: z.enum(["swap", "in_place"]).optional(),
  })
  .strict()
