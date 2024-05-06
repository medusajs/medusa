import { z } from "zod"
import { ProductCreateSchema, ProductCreateVariantSchema } from "./constants"

export type ProductCreateSchemaType = z.infer<typeof ProductCreateSchema>
export type ProductCreateVariantSchemaType = z.infer<
  typeof ProductCreateVariantSchema
>
