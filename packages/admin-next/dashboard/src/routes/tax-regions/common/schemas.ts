import { z } from "zod"
import { RuleReferenceType } from "./constants"

const ReferenceSchema = z.object({
  value: z.string(),
  label: z.string(),
})

export type Reference = z.infer<typeof ReferenceSchema>

export const TargetSchema = z.object({
  reference_type: z.nativeEnum(RuleReferenceType),
  references: z.array(ReferenceSchema),
})

export type Target = z.infer<typeof TargetSchema>
