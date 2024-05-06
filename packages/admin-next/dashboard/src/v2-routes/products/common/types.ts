import { z } from "zod"
import {
  CreateProductOptionSchema,
  CreateVariantSchema,
  UpdateVariantSchema,
} from "./schemas"

export type CreateVariantSchemaType = z.infer<typeof CreateVariantSchema>
export type UpdateVariantSchemaType = z.infer<typeof UpdateVariantSchema>

export type CreateProductOptionSchemaType = z.infer<
  typeof CreateProductOptionSchema
>
