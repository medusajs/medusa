import { HttpTypes } from "@medusajs/types"
import { formatPercentage } from "../../../../../lib/percentage-helpers"

type TaxOverrideItemProps = {
  taxRate: HttpTypes.AdminTaxRate
}

export const TaxOverrideItem = ({ taxRate }: TaxOverrideItemProps) => {
  const rules = taxRate.rules

  const references = rules.map((rule) => {
    return rule.reference
  })

  return <div></div>
}

async function hydrateLabel({ taxRate }: TaxOverrideItemProps): Promise<{
  rate: string
}> {
  const formattedRate = formatPercentage(taxRate.rate)

  return { rate: formattedRate }
}
