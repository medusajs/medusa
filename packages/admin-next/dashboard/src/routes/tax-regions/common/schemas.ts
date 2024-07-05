import { z } from "zod"
import { TaxRateRuleReferenceType } from "./constants"

export const TaxRateRuleReferenceSchema = z.object({
  value: z.string(),
  label: z.string(),
})

export type TaxRateRuleReference = z.infer<typeof TaxRateRuleReferenceSchema>

export const TaxRateRuleTargetSchema = z.object({
  reference_type: z.nativeEnum(TaxRateRuleReferenceType),
  references: z.array(TaxRateRuleReferenceSchema),
})

export type TaxRateRuleTarget = z.infer<typeof TaxRateRuleTargetSchema>
