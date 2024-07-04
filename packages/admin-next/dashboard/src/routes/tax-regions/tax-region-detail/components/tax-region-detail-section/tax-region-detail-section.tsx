import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Badge, Container, Text, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { formatPercentage } from "../../../../../lib/percentage-helpers"
import { TaxRegionCard } from "../../../common/components/tax-region-card"
import { useDeleteTaxRegionAction } from "../../../common/hooks"

type TaxRegionDetailSectionProps = {
  taxRegion: HttpTypes.AdminTaxRegion
}

export const TaxRegionDetailSection = ({
  taxRegion,
}: TaxRegionDetailSectionProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteTaxRegionAction({ taxRegion })

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
                {
                  actions: [
                    {
                      label: t("actions.delete"),
                      icon: <Trash />,
                      onClick: handleDelete,
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
