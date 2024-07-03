import {
  AddPromotionRulesWorkflowDTO,
  IPromotionModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName, RuleType } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const addRulesToPromotionsStepId = "add-rules-to-promotions"
export const addRulesToPromotionsStep = createStep(
  addRulesToPromotionsStepId,
  async (input: AddPromotionRulesWorkflowDTO, { container }) => {
    const { data, rule_type: ruleType } = input

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    const createdPromotionRules =
      ruleType === RuleType.RULES
        ? await promotionModule.addPromotionRules(data.id, data.rules)
        : []

    const createdPromotionBuyRules =
      ruleType === RuleType.BUY_RULES
        ? await promotionModule.addPromotionBuyRules(data.id, data.rules)
        : []

    const createdPromotionTargetRules =
      ruleType === RuleType.TARGET_RULES
        ? await promotionModule.addPromotionTargetRules(data.id, data.rules)
        : []

    const promotionRules = [
      ...createdPromotionRules,
      ...createdPromotionBuyRules,
      ...createdPromotionTargetRules,
    ]

    return new StepResponse(promotionRules, {
      id: data.id,
      promotionRuleIds: createdPromotionRules.map((pr) => pr.id),
      buyRuleIds: createdPromotionBuyRules.map((pr) => pr.id),
      targetRuleIds: createdPromotionBuyRules.map((pr) => pr.id),
    })
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const {
      id,
      promotionRuleIds = [],
      buyRuleIds = [],
      targetRuleIds = [],
    } = data

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    promotionRuleIds.length &&
      (await promotionModule.removePromotionRules(id, promotionRuleIds))

    buyRuleIds.length &&
      (await promotionModule.removePromotionBuyRules(id, buyRuleIds))

    targetRuleIds.length &&
      (await promotionModule.removePromotionBuyRules(id, targetRuleIds))
  }
)
