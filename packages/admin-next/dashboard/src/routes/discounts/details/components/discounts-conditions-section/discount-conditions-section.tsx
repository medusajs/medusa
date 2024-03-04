import type { Discount, DiscountCondition } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"
import { PencilSquare } from "@medusajs/icons"
import { useMemo } from "react"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { ListSummary } from "../../../../../components/common/list-summary"

type ConditionTypeProps = {
  condition: DiscountCondition
}

function ConditionType({ condition }: ConditionTypeProps) {
  const operator = condition.operator === "in" ? "including" : "excluding"
  const entity = condition.type

  return (
    <div className="bg-ui-bg-subtle shadow-borders-base flex flex-row justify-around rounded-md p-2">
      <span className="text-ui-fg-subtle txt-small">
        <Trans
          count={condition.products.length}
          i18nKey={`discounts.conditions.${operator}.${entity}`}
          components={[
            <span className="bg-ui-tag-neutral-bg mx-1 rounded-md border p-1">
              <ListSummary
                inline
                list={condition[entity].map((p) => p.title || p.name)}
              />
            </span>,
            <span className="bg-ui-tag-neutral-bg mx-1 rounded-md border p-1" />,
          ]}
        />
      </span>
    </div>
  )
}

type DiscountConditionsSectionProps = {
  discount: Discount
}

export const DiscountConditionsSection = ({
  discount,
}: DiscountConditionsSectionProps) => {
  const { t } = useTranslation()

  const conditions = useMemo(
    () =>
      discount.rule.conditions.sort((c1, c2) => c1.type.localeCompare(c2.type)),
    [discount]
  )

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col">
          <Heading>{t("fields.conditions")}</Heading>
        </div>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: `conditions`,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="text-ui-fg-subtle flex flex-col gap-2 px-6 pb-4 pt-2">
        {!conditions.length && (
          <span className="text-ui-fg-subtle text-small text-center">
            {t("discounts.noConditions")}
          </span>
        )}
        {conditions.map((condition) => (
          <ConditionType key={condition.id} condition={condition} />
        ))}
      </div>
    </Container>
  )
}
