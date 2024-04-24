import { RouteFocusModal } from "../../../components/route-modal"
import { useCampaigns } from "../../../hooks/api/campaigns"
import {
  usePromotionRuleAttributes,
  usePromotionRuleOperators,
  usePromotionRules,
} from "../../../hooks/api/promotions"
import { CreatePromotionForm } from "./components/create-promotion-form/create-promotion-form"

export const PromotionCreate = () => {
  const { attributes: ruleAttributes } = usePromotionRuleAttributes("rules")
  const { attributes: targetRuleAttributes } =
    usePromotionRuleAttributes("target-rules")
  const { attributes: buyRuleAttributes } =
    usePromotionRuleAttributes("buy-rules")

  const { rules } = usePromotionRules(null, "rules")
  const { rules: targetRules } = usePromotionRules(null, "target-rules")
  const { rules: buyRules } = usePromotionRules(null, "buy-rules")
  const { operators } = usePromotionRuleOperators()
  const { campaigns } = useCampaigns()

  return (
    <RouteFocusModal>
      {rules &&
        buyRules &&
        targetRules &&
        campaigns &&
        operators &&
        ruleAttributes &&
        targetRuleAttributes &&
        buyRuleAttributes && (
          <CreatePromotionForm
            ruleAttributes={ruleAttributes}
            targetRuleAttributes={targetRuleAttributes}
            buyRuleAttributes={buyRuleAttributes}
            operators={operators}
            rules={rules}
            targetRules={targetRules}
            buyRules={buyRules}
            campaigns={campaigns}
          />
        )}
    </RouteFocusModal>
  )
}
