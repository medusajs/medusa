import { z } from "@medusajs/framework/zod"
import { createFindParams } from "../../utils/validators"

export type AdminCreateNoteType = z.infer<typeof AdminCreateNote>
// Note: `author_id` is accepted here only so the request body doesn't fail
// validation when a client sends one - `@medusajs/framework`'s zodValidator
// always calls `.strict()` on every body schema, so an undeclared field
// would otherwise cause a 400 instead of simply being ignored. The route
// handler never reads `author_id` from `req.validatedBody`: it always comes
// from `req.auth_context.actor_id`, so a client-supplied value has no effect.
export const AdminCreateNote = z.object({
  resource_type: z.enum(["order", "customer", "order_line_item"]),
  resource_id: z.string(),
  value: z.string(),
  author_id: z.string().optional(),
})

export type AdminGetNotesParamsType = z.infer<typeof AdminGetNotesParams>
export const AdminGetNotesParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    resource_type: z.string().optional(),
    resource_id: z.union([z.string(), z.array(z.string())]).optional(),
  })
)
