import { Container, Copy, Heading, Text } from "@medusajs/ui"

import { ActionMenu } from "../../../../../components/common/action-menu"
import type { Discount } from "@medusajs/medusa"
import { ListSummary } from "../../../../../components/common/list-summary"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { PencilSquare } from "@medusajs/icons"
import { useTranslation } from "react-i18next"

export const DetailsSection = ({ discount }: { discount: Discount }) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("general.details")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "edit",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("fields.code")}
        </Text>
        <div className="flex items-center gap-1">
          <Text
            size="small"
            weight="plus"
            leading="compact"
            className="text-ui-fg-base text-pretty"
          >
            {discount.code}
          </Text>
          <Copy content={discount.code} variant="mini" />
        </div>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("fields.type")}
        </Text>
        <Text size="small" leading="compact" className="text-pretty">
          {discount.rule.type === "percentage"
            ? t("discounts.percentageDiscount")
            : discount.rule.type === "free_shipping"
              ? t("discounts.freeShipping")
              : t("discounts.fixedDiscount")}
        </Text>
      </div>

      {discount.rule.type === "percentage" && (
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" weight="plus" leading="compact">
            {t("fields.value")}
          </Text>
          <Text size="small" leading="compact" className="text-pretty">
            {discount.rule.value}
          </Text>
        </div>
      )}

      {discount.rule.type === "fixed" && (
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" weight="plus" leading="compact">
            {t("fields.amount")}
          </Text>
          <Text size="small" className="text-pretty">
            <MoneyAmountCell
              currencyCode={discount.regions[0]?.currency_code}
              amount={discount.rule.value}
            />
          </Text>
        </div>
      )}

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("discounts.validRegions")}
        </Text>
        <Text size="small" className="text-pretty">
          <ListSummary list={discount.regions.map((r) => r.name)} />
        </Text>
      </div>
    </Container>
  )
}
