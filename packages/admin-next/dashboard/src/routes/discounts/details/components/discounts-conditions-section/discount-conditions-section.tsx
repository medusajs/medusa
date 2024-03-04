import type { Discount, DiscountCondition } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"
import { PencilSquare } from "@medusajs/icons"
import { useMemo } from "react"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { ListSummary } from "../../../../../components/common/list-summary"
import { NoRecords } from "../../../../../components/common/empty-table-content"

type ConditionTypeProps = {
  condition: DiscountCondition
}

const N = 2

function ConditionType({ condition }: ConditionTypeProps) {
  const operator = condition.operator === "in" ? "including" : "excluding"
  const entity = condition.type

  return (
    <div className="bg-ui-bg-subtle shadow-borders-base flex flex-row justify-around rounded-md p-2">
      <span className="text-ui-fg-subtle txt-small">
        <Trans
          count={
            condition[entity].length > N
              ? N - condition[entity].length
              : condition[entity].length
          }
          i18nKey={`discounts.conditions.${operator}.${entity}`}
          components={[
            <span className="bg-ui-tag-neutral-bg mx-1 rounded-md border p-1">
              <ListSummary
                inline
                n={N}
                list={condition[entity].map(
                  (p) => p.title || p.name || p.value
                )}
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
        {!conditions.length && <NoRecords className="h-[180px]" />}
        {conditions.map((condition) => (
          <ConditionType key={condition.id} condition={condition} />
        ))}
      </div>
    </Container>
  )
}
