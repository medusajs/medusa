import { PencilSquare } from "@medusajs/icons"
import type {
  CustomerGroup,
  Discount,
  DiscountCondition,
  Product,
  ProductCollection,
  ProductTag,
  ProductType,
} from "@medusajs/medusa"
import { Badge, Container, Heading } from "@medusajs/ui"
import { useMemo } from "react"
import { Trans, useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import { ListSummary } from "../../../../../components/common/list-summary"

type ConditionTypeProps = {
  condition: DiscountCondition
}

const N = 1

const hasTitle = (p: unknown): p is Product | ProductCollection => {
  return (p as { title: string }).title !== undefined
}

const hasName = (p: unknown): p is CustomerGroup => {
  return (p as { name: string }).name !== undefined
}

const hasValue = (p: unknown): p is ProductTag | ProductType => {
  return (p as { value: string }).value !== undefined
}

function ConditionType({ condition }: ConditionTypeProps) {
  const { t } = useTranslation()

  const operator = condition.operator === "in" ? "including" : "excluding"
  const entity = condition.type

  const list = condition[entity].map((p) => {
    if (hasTitle(p)) {
      return p.title
    }

    if (hasName(p)) {
      return p.name
    }

    if (hasValue(p)) {
      return p.value
    }
  }) as string[]

  return (
    <div className="bg-ui-bg-subtle shadow-borders-base flex justify-around rounded-md p-2">
      <span className="text-ui-fg-subtle txt-compact-xsmall whitespace-nowrap">
        <Trans
          t={t}
          count={
            condition[entity].length > N
              ? N - condition[entity].length
              : condition[entity].length
          }
          i18nKey={`discounts.conditions.${operator}.${entity}`}
          components={[
            <Badge
              size="2xsmall"
              key="discounts-incl"
              className="mx-1 max-w-[120px]"
            >
              <ListSummary
                inline
                n={N}
                list={list}
                className="!txt-compact-xsmall-plus"
              />
            </Badge>,
            <Badge size="2xsmall" key="discounts-excl" className="mx-1" />,
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
