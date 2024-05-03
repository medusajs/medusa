import {
  CreatePromotionRuleDTO,
  PromotionRuleTypes,
  UpdatePromotionRuleDTO,
} from "./common"

export type AddPromotionRulesWorkflowDTO = {
  rule_type: PromotionRuleTypes
  data: {
    id: string
    rules: CreatePromotionRuleDTO[]
  }
}

export type RemovePromotionRulesWorkflowDTO = {
  rule_type: PromotionRuleTypes
  data: {
    id: string
    rule_ids: string[]
  }
}

export type UpdatePromotionRulesWorkflowDTO = {
  data: UpdatePromotionRuleDTO[]
}
