import React from "react"
import { UseFormReturn } from "react-hook-form"

import { CreateProductVariantSchema } from "./constants"

type PricingTabProps = {
  form: UseFormReturn<typeof CreateProductVariantSchema>
}

function PricingTab({ form }: PricingTabProps) {
  return <div>PRICING</div>
}

export default PricingTab
