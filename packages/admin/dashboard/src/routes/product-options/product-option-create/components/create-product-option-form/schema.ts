import { z } from "zod"

export const CreateProductOptionDetailsSchema = z.object({
  title: z.string().min(1),
  values: z.array(z.string()).min(1, "At least one value is required"),
})

export type CreateProductOptionSchema = z.infer<
  typeof CreateProductOptionSchema
>
export const CreateProductOptionSchema = z
  .object({
    value_ranks: z.record(z.string(), z.number()).optional(),
  })
  .merge(CreateProductOptionDetailsSchema)
