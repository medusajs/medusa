import { PromotionRuleDTO } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import {
  usePromotion,
  usePromotionRuleAttributes,
  usePromotionRuleOperators,
} from "../../../hooks/api/promotions"
import { EditRulesForm } from "./components/edit-rules-form"

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
  const { promotion, isLoading, isError, error } = usePromotion(id)
  const {
    attributes,
    isError: isAttributesError,
    error: attributesError,
  } = usePromotionRuleAttributes(ruleType!)
  const {
    operators,
    isError: isOperatorsError,
    error: operatorsError,
  } = usePromotionRuleOperators()

  if (promotion) {
    if (ruleType === RuleType.RULES) {
      rules.push(...(promotion.rules || []))
    } else if (ruleType === RuleType.TARGET_RULES) {
      rules.push(...(promotion?.application_method?.target_rules || []))
    } else if (ruleType === RuleType.BUY_RULES) {
      rules.push(...(promotion.application_method?.buy_rules || []))
    }
  }

  if (isError || isAttributesError || isOperatorsError) {
    throw error || attributesError || operatorsError
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t(`promotions.edit.${ruleType}.title`)}</Heading>
      </RouteDrawer.Header>

      {!isLoading && promotion && attributes && operators && (
        <EditRulesForm
          promotion={promotion}
          rules={rules}
          ruleType={ruleType}
          attributes={attributes}
          operators={operators}
        />
      )}
    </RouteDrawer>
  )
}
