import { PencilSquare } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { formatPercentage } from "../../../../../lib/percentage-helpers"
import { TaxRegionCard } from "../../../common/components/tax-region-card"

type TaxRegionDetailSectionProps = {
  taxRegion: HttpTypes.AdminTaxRegion
}

export const TaxRegionDetailSection = ({
  taxRegion,
}: TaxRegionDetailSectionProps) => {
  const { t } = useTranslation()
  const defaultRates = taxRegion.tax_rates.filter((r) => r.is_default === true)

  return (
    <Container className="divide-y p-0">
      <TaxRegionCard taxRegion={taxRegion} type="header" asLink={false} />
      {defaultRates.map((rate) => {
        return (
          <div
            key={rate.id}
            className="text-ui-fg-subtle grid grid-cols-[1fr_1fr_28px] items-center gap-4 px-6 py-4"
          >
            <Text size="small" weight="plus" leading="compact">
              {rate.name}
            </Text>
            <Text size="small" leading="compact">
              {formatPercentage(rate.rate)}
            </Text>
            <ActionMenu
              groups={[
                {
                  actions: [
                    {
                      label: t("actions.edit"),
                      icon: <PencilSquare />,
                      to: `tax-rates/${rate.id}/edit`,
                    },
                  ],
                },
              ]}
            />
          </div>
        )
      })}
    </Container>
  )
}
