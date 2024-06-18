import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import { TaxRegionCard } from "../../../common/components/tax-region-card"

type TaxRegionDetailSectionProps = {
  taxRegion: HttpTypes.AdminTaxRegion
}

export const TaxRegionDetailSection = ({
  taxRegion,
}: TaxRegionDetailSectionProps) => {
  return (
    <Container className="p-0">
      <TaxRegionCard taxRegion={taxRegion} type="header" asLink={false} />
    </Container>
  )
}
