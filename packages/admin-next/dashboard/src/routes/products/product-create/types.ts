import { z } from "zod"
import { ProductCreateSchema } from "./constants"

export type ProductCreateSchemaType = z.infer<typeof ProductCreateSchema>
