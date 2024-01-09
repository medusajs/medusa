import { Region } from "@medusajs/medusa"
import { Container, Heading, StatusBadge, Text, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

type Props = {
  region: Region
}

export const TaxDetailsSection = ({ region }: Props) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-ui-border-base divide-y p-0">
      <div className="px-8 py-6">
        <Heading>{region.name}</Heading>
        <div className="text-ui-fg-subtle flex items-center gap-x-2">
          <Text leading="compact" size="small">
            {region.countries
              .slice(0, 2)
              .map((c) => c.display_name)
              .join(", ")}
          </Text>
          {region.countries.length > 2 && (
            <Tooltip
              content={
                <ul>
                  {region.countries.slice(2).map((c) => (
                    <li key={c.id}>{c.display_name}</li>
                  ))}
                </ul>
              }
            >
              <Text
                leading="compact"
                size="small"
                weight="plus"
                className="cursor-default"
              >
                {t("general.plusCountMore", {
                  count: region.countries.length - 2,
                })}
              </Text>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 px-8 py-6">
        <Text size="small" weight="plus" leading="compact">
          Tax Provider
        </Text>
        <Text size="small" leading="compact">
          {region.tax_provider_id
            ? region.tax_provider_id
            : "System Tax Provider"}
        </Text>
      </div>
      <div className="grid grid-cols-2 px-8 py-6">
        <Text size="small" weight="plus" leading="compact">
          Automatic Tax Calculation
        </Text>
        <StatusBadge
          color={region.automatic_taxes ? "green" : "green"}
          className="w-fit"
        >
          {region.automatic_taxes
            ? t("general.enabled")
            : t("general.disabled")}
        </StatusBadge>
      </div>
      <div className="grid grid-cols-2 px-8 py-6">
        <Text size="small" weight="plus" leading="compact">
          Gift Cards Taxable
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
    </Container>
  )
}
