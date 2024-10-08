import { PencilSquare } from "@medusajs/icons"
import { HttpTypes, PromotionRuleTypes } from "@medusajs/types"
import { Badge, Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { BadgeListSummary } from "../../../../../components/common/badge-list-summary"
import { NoRecords } from "../../../../../components/common/empty-table-content"

type RuleProps = {
  rule: HttpTypes.AdminPromotionRule
}

function RuleBlock({ rule }: RuleProps) {
  return (
    <div className="bg-ui-bg-subtle shadow-borders-base align-center flex justify-around rounded-md p-2">
      <div className="text-ui-fg-subtle txt-compact-xsmall flex items-center whitespace-nowrap">
        <Badge
          size="2xsmall"
          key="rule-attribute"
          className="txt-compact-xsmall-plus tag-neutral-text mx-1 inline-block truncate"
        >
          {rule.attribute_label}
        </Badge>

        <span className="txt-compact-2xsmall mx-1 inline-block">
          {rule.operator_label}
        </span>

        <BadgeListSummary
          inline
          className="!txt-compact-small-plus"
          list={
            rule.field_type === "number"
              ? [rule.values]
              : rule.values?.map((v) => v.label)
          }
        />
      </div>
    </div>
  )
}

type PromotionConditionsSectionProps = {
  rules: HttpTypes.AdminPromotionRule[]
  ruleType: PromotionRuleTypes
}

export const PromotionConditionsSection = ({
  rules,
  ruleType,
}: PromotionConditionsSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col">
          <Heading>
            {t(`promotions.fields.conditions.${ruleType}.title`)}
          </Heading>
        </div>

        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: `${ruleType}/edit`,
                },
              ],
            },
          ]}
        />
      </div>

      <div className="text-ui-fg-subtle flex flex-col gap-2 px-6 pb-4 pt-2">
        {!rules.length && (
          <NoRecords
            className="h-[180px]"
            title={t("general.noRecordsTitle")}
            message={t("promotions.conditions.list.noRecordsMessage")}
            action={{
              to: `${ruleType}/edit`,
              label: t("promotions.conditions.add"),
            }}
            buttonVariant="transparentIconLeft"
          />
        )}

        {rules.map((rule) => (
          <RuleBlock key={`${rule.id}-${rule.attribute}`} rule={rule} />
        ))}
      </div>
    </Container>
  )
}
