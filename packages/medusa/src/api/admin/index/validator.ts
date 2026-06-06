import { z } from "@zjedene-medusa/framework/zod"

export const AdminIndexSyncPayload = z.object({
  strategy: z.enum(["full", "reset"]).optional(),
})
