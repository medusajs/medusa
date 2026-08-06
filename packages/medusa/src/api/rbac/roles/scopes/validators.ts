import { z } from "@medusajs/framework/zod"

export const AdminGetRbacScopesParams = z.object({
  actor_type: z.string().min(1),
  actor_id: z.string().min(1),
  grantee_type: z.string().min(1),
})
