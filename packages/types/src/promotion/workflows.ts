import { CreatePromotionRuleDTO, PromotionRuleTypes } from "./common"

export type AddPromotionRulesWorkflowDTO = {
  rule_type: PromotionRuleTypes
  data: {
    id: string
    rules: CreatePromotionRuleDTO[]
  }
}
