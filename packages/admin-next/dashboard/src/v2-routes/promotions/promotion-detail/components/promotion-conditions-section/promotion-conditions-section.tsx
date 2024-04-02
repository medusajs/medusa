import { PencilSquare } from "@medusajs/icons"
import { PromotionRuleDTO, PromotionRuleTypes } from "@medusajs/types"
import { Badge, Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"

type RuleProps = {
  rule: PromotionRuleDTO
}

function RuleBlock({ rule }: RuleProps) {
  return (
    <div className="bg-ui-bg-subtle shadow-borders-base flex justify-around rounded-md p-2">
      <span className="text-ui-fg-subtle txt-compact-xsmall whitespace-nowrap">
        <Badge
          size="small"
          key="rule-attribute"
          className="mx-1 max-w-[120px] txt-compact-xsmall-plus tag-neutral-text"
        >
          {rule.attribute}
        </Badge>

        <span className="mx-1 txt-compact-small">{rule.operator}</span>

        <Badge
          size="small"
          key="rule-value"
          className="mx-1 max-w-[120px] txt-compact-xsmall-plus tag-neutral-text"
        >
          {rule.values?.map((v) => v.value).join(",")}
        </Badge>
      </span>
    </div>
  )
}

type PromotionConditionsSectionProps = {
  rules: PromotionRuleDTO[]
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
                  to: `${ruleType.split("_").join("-")}/edit`,
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
            title="No records yet."
            message="Please check back later or add a target condition today"
            action={{ to: "/promotions", label: "Add condition" }}
            buttonVariant="transparentIconLeft"
          />
        )}

        {rules.map((rule) => (
          <RuleBlock key={rule.id} rule={rule} />
        ))}
      </div>
    </Container>
  )
}
