import { HttpTypes } from "@medusajs/types"

import { Target } from "./schemas"

export const createTaxRulePayload = (
  target: Target
): HttpTypes.AdminCreateTaxRate["rules"] => {
  return target.references.map((reference) => ({
    reference: target.reference_type,
    reference_id: reference.value,
  }))
}
