import { PencilSquare } from "@medusajs/icons"
import { Region } from "@medusajs/medusa"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { formatPercentage } from "../../../../../lib/percentage-helpers"

type TaxDefaultRateSectionProps = {
  region: Region
}

export const TaxDefaultTaxRateSection = ({
  region,
}: TaxDefaultRateSectionProps) => {
  const { t } = useTranslation()

  const defaultTaxCode = region.tax_code
  const defaultTaxRate = region.tax_rate

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("taxes.defaultRate.sectionTitle")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "tax-rates/default/edit",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("fields.rate")}
        </Text>
        <Text size="small" leading="compact">
          {formatPercentage(defaultTaxRate)}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("fields.code")}
        </Text>
        <Text size="small" leading="compact">
          {defaultTaxCode ?? "-"}
        </Text>
      </div>
    </Container>
  )
}
