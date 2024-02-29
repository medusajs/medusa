import { Discount } from "@medusajs/medusa"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { PencilSquare } from "@medusajs/icons"

type DiscountConfigurationsSection = {
  discount: Discount
}

function formatTime(dateTime?: string) {
  if (!dateTime) {
    return
  }
  const date = new Date(dateTime)
  const a = date.toDateString().split(" ").slice(1).join(" ")
  return `${a} at ${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`
}

export const DiscountConfigurationSection = ({
  discount,
}: DiscountConfigurationsSection) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col">
          <Heading>{t("fields.configurations")}</Heading>
        </div>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: `configuration`,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("discounts.startDate")}
        </Text>
        <Text size="small" leading="compact" className="text-pretty">
          {formatTime(discount.starts_at as unknown as string)}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("discounts.endDate")}
        </Text>
        <Text size="small" leading="compact" className="text-pretty">
          {formatTime(discount.ends_at as unknown as string)}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("discounts.redemptionsLimit")}
        </Text>
        <Text size="small" leading="compact" className="text-pretty">
          {discount.usage_limit || "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("discounts.validDuration")}
        </Text>
        <Text size="small" leading="compact" className="text-pretty">
          {discount.valid_duration || "-"}
        </Text>
      </div>
    </Container>
  )
}
