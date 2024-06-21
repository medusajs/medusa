import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTaxRates } from "../../../../../hooks/api/tax-rates"
import { TaxOverrideItem } from "./tax-override-item"

type TaxRegionOverrideSectionProps = {
  taxRegion: HttpTypes.AdminTaxRegion
}

export const TaxRegionOverrideSection = ({
  taxRegion,
}: TaxRegionOverrideSectionProps) => {
  const { tax_rates, isPending, isError, error } = useTaxRates({
    tax_region_id: taxRegion.id,
    is_default: false,
  })

  console.log(tax_rates)

  return (
    <Container>
      <div>
        <Heading level="h2">Tax Overrides</Heading>
      </div>
      <div>
        {tax_rates?.map((taxRate) => {
          return <TaxOverrideItem taxRate={taxRate} key={taxRate.id} />
        })}
      </div>
    </Container>
  )
}
