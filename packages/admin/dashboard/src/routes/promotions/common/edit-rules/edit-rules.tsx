import { PromotionRuleDTO } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../../components/modals"
import { usePromotion } from "../../../../hooks/api/promotions"
import { EditRulesWrapper } from "./components/edit-rules-wrapper"

export enum RuleType {
  RULES = "rules",
  BUY_RULES = "buy-rules",
  TARGET_RULES = "target-rules",
}
export type RuleTypeValues = "rules" | "buy-rules" | "target-rules"

export const EditRules = () => {
  const params = useParams()
  const allowedParams: string[] = [
    RuleType.RULES,
    RuleType.BUY_RULES,
    RuleType.TARGET_RULES,
  ]

  if (!allowedParams.includes(params.ruleType!)) {
    throw "invalid page"
  }

  const { t } = useTranslation()
  const ruleType = params.ruleType as RuleTypeValues
  const id = params.id as string
  const rules: PromotionRuleDTO[] = []
  const { promotion, isPending: isLoading, isError, error } = usePromotion(id)

  if (promotion) {
    if (ruleType === RuleType.RULES) {
      rules.push(...(promotion.rules || []))
    } else if (ruleType === RuleType.TARGET_RULES) {
      rules.push(...(promotion?.application_method?.target_rules || []))
    } else if (ruleType === RuleType.BUY_RULES) {
      rules.push(...(promotion.application_method?.buy_rules || []))
    }
  }

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t(`promotions.edit.${ruleType}.title`)}</Heading>
      </RouteDrawer.Header>

      {!isLoading && promotion && (
        <EditRulesWrapper
          promotion={promotion}
          rules={rules}
          ruleType={ruleType}
        />
      )}
    </RouteDrawer>
  )
}
