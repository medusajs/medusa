import { PencilSquare } from "@medusajs/icons"
import { Region } from "@medusajs/medusa"
import { Container, Heading, StatusBadge, Text, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

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
          Countries
        </Text>
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
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          Tax provider
        </Text>
        <Text size="small" leading="compact">
          {region.tax_provider_id
            ? region.tax_provider_id
            : "System Tax Provider"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          Automatically calculate taxes
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
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          Taxes on gift cards
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
          Tax inclusive prices
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
