import { z } from "zod"

export const CreateCategoryDetailsSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  handle: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  visibility: z.enum(["public", "internal"]),
})

export type CreateCategorySchema = z.infer<typeof CreateCategorySchema>
export const CreateCategorySchema = z
  .object({
    rank: z.number().nullable(),
    parent_category_id: z.string().nullable(),
  })
  .merge(CreateCategoryDetailsSchema)
