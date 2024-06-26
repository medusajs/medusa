import { z } from "zod"

export const ReturnCreateSchema = z.object({})

export type ReturnCreateSchemaType = z.infer<typeof ReturnCreateSchema>
