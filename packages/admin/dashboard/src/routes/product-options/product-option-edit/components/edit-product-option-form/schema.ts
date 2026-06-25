import { z } from "zod"

export const EditProductOptionDetailsSchema = z.object({
  title: z.string().min(1),
  values: z.array(z.string()).min(1, "At least one value is required"),
})

export type EditProductOptionSchema = z.infer<typeof EditProductOptionSchema>
export const EditProductOptionSchema = z
  .object({
    value_ranks: z.record(z.string(), z.number()).optional(),
  })
  .merge(EditProductOptionDetailsSchema)