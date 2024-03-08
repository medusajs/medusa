import { PencilSquare } from "@medusajs/icons"
import { Region } from "@medusajs/medusa"
import { Badge, Container, Heading, StatusBadge, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { formatPercentage } from "../../../../../lib/percentage-helpers"

type Props = {
  region: Region
}

export const TaxDetailsSection = ({ region }: Props) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{region.name}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  icon: <PencilSquare />,
                  to: "edit",
                },
              ],
            },
          ]}
        />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("taxes.settings.taxProviderLabel")}
        </Text>
        <Text size="small" leading="compact">
          {region.tax_provider_id
            ? region.tax_provider_id
            : t("taxes.settings.systemTaxProviderLabel")}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("taxes.settings.calculateTaxesAutomaticallyLabel")}
        </Text>
        <StatusBadge
          color={region.automatic_taxes ? "green" : "grey"}
          className="w-fit"
        >
          {region.automatic_taxes
            ? t("general.enabled")
            : t("general.disabled")}
        </StatusBadge>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("taxes.settings.applyTaxesOnGiftCardsLabel")}
        </Text>
        <StatusBadge
          color={region.gift_cards_taxable ? "green" : "grey"}
          className="w-fit"
        >
          {region.gift_cards_taxable
            ? t("general.enabled")
            : t("general.disabled")}
        </StatusBadge>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("fields.taxInclusivePricing")}
        </Text>
        <StatusBadge
          color={region.includes_tax ? "green" : "grey"}
          className="w-fit"
        >
          {region.gift_cards_taxable
            ? t("general.enabled")
            : t("general.disabled")}
        </StatusBadge>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("taxes.settings.defaultTaxRateLabel")}
        </Text>
        <div className="flex items-center gap-x-2">
          <Text size="small" leading="compact">
            {formatPercentage(region.tax_rate)}
          </Text>
          {region.tax_code && <Badge size="2xsmall">{region.tax_code}</Badge>}
        </div>
      </div>
    </Container>
  )
}
