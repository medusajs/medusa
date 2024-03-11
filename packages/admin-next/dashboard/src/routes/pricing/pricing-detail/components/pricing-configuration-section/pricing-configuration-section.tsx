import { PencilSquare } from "@medusajs/icons"
import { PriceList } from "@medusajs/medusa"
import { Container, Heading, Text, Tooltip } from "@medusajs/ui"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type PricingConfigurationSectionProps = {
  priceList: PriceList
}

export const PricingConfigurationSection = ({
  priceList,
}: PricingConfigurationSectionProps) => {
  const { t } = useTranslation()

  const firstCustomerGroups = priceList.customer_groups?.slice(0, 3)
  const remainingCustomerGroups = priceList.customer_groups?.slice(3)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("fields.configurations")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "/configurations/edit",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text leading="compact" size="small" weight="plus">
          {t("fields.startDate")}
        </Text>
        <Text size="small" className="text-pretty">
          {priceList.starts_at
            ? format(new Date(priceList.starts_at), "dd MMM yyyy")
            : "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text leading="compact" size="small" weight="plus">
          {t("fields.endDate")}
        </Text>
        <Text size="small" className="text-pretty">
          {priceList.ends_at
            ? format(new Date(priceList.ends_at), "dd MMM yyyy")
            : "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text leading="compact" size="small" weight="plus">
          {t("pricing.settings.customerGroupsLabel")}
        </Text>
        <Text size="small" className="text-pretty">
          <span>
            {firstCustomerGroups.length > 0
              ? firstCustomerGroups.join(", ")
              : "-"}
          </span>
          {remainingCustomerGroups.length > 0 && (
            <Tooltip
              content={
                <ul>
                  {remainingCustomerGroups.map((cg) => (
                    <li key={cg.id}>{cg.name}</li>
                  ))}
                </ul>
              }
            >
              <span className="text-ui-fg-muted">
                {" "}
                {t("general.plusCountMore", {
                  count: remainingCustomerGroups.length,
                })}
              </span>
            </Tooltip>
          )}
        </Text>
      </div>
    </Container>
  )
}
