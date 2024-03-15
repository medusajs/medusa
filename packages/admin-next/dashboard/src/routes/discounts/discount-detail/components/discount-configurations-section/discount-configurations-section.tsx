import { PencilSquare } from "@medusajs/icons"
import { format, formatDuration } from "date-fns"
import { parse } from "iso8601-duration"
import { useMemo } from "react"

import { Discount } from "@medusajs/medusa"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"

type DiscountConfigurationsSection = {
  discount: Discount
}

function formatTime(dateTime?: string | Date | null) {
  if (!dateTime) {
    return "-"
  }
  return format(new Date(dateTime), "dd MMM, yyyy, HH:mm:ss")
}

export const DiscountConfigurationSection = ({
  discount,
}: DiscountConfigurationsSection) => {
  const { t } = useTranslation()

  const duration = useMemo(() => {
    if (!discount.valid_duration) {
      return "-"
    }
    return formatDuration(parse(discount.valid_duration))
  }, [discount.valid_duration])

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
          {formatTime(discount.starts_at)}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("discounts.endDate")}
        </Text>
        <Text size="small" leading="compact" className="text-pretty">
          {formatTime(discount.ends_at)}
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
          {duration}
        </Text>
      </div>
    </Container>
  )
}
