import { HttpTypes } from "@medusajs/types"
import { Badge, Container, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { TaxRateLine } from "../../../common/components/tax-rate-line"
import { TaxRegionCard } from "../../../common/components/tax-region-card"

type TaxRegionProvinceDetailSectionProps = {
  taxRegion: HttpTypes.AdminTaxRegion
}

export const TaxRegionProvinceDetailSection = ({
  taxRegion,
}: TaxRegionProvinceDetailSectionProps) => {
  const { t } = useTranslation()

  const defaultRates = taxRegion.tax_rates.filter((r) => r.is_default === true)
  const showBage = defaultRates.length === 0

  return (
    <Container className="divide-y p-0">
      <TaxRegionCard
        taxRegion={taxRegion}
        type="header"
        asLink={false}
        badge={
          showBage && (
            <Tooltip content={t("taxRegions.fields.noDefaultRate.tooltip")}>
              <Badge color="orange" size="2xsmall" className="cursor-default">
                {t("taxRegions.fields.noDefaultRate.label")}
              </Badge>
            </Tooltip>
          )
        }
      />
      {defaultRates.map((rate) => {
        return <TaxRateLine key={rate.id} taxRate={rate} isSublevelTaxRate />
      })}
    </Container>
  )
}
