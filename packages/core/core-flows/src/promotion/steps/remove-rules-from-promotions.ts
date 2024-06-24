import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreatePromotionRuleDTO,
  IPromotionModuleService,
  PromotionRuleDTO,
  RemovePromotionRulesWorkflowDTO,
} from "@medusajs/types"
import { RuleType } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const removeRulesFromPromotionsStepId = "remove-rules-from-promotions"
export const removeRulesFromPromotionsStep = createStep(
  removeRulesFromPromotionsStepId,
  async (input: RemovePromotionRulesWorkflowDTO, { container }) => {
    const { data, rule_type: ruleType } = input

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    const promotion = await promotionModule.retrievePromotion(data.id, {
      relations: [
        "rules.values",
        "application_method.target_rules.values",
        "application_method.buy_rules.values",
      ],
    })

    const promotionRulesToCreate: CreatePromotionRuleDTO[] = []
    const buyRulesToCreate: CreatePromotionRuleDTO[] = []
    const targetRulesToCreate: CreatePromotionRuleDTO[] = []

    if (ruleType === RuleType.RULES) {
      const rules = promotion.rules!
      promotionRulesToCreate.push(...promotionRuleAttribute(rules))

      await promotionModule.removePromotionRules(data.id, data.rule_ids)
    }

    if (ruleType === RuleType.BUY_RULES) {
      const rules = promotion.application_method?.buy_rules!
      buyRulesToCreate.push(...promotionRuleAttribute(rules))

      await promotionModule.removePromotionBuyRules(data.id, data.rule_ids)
    }

    if (ruleType === RuleType.TARGET_RULES) {
      const rules = promotion.application_method?.target_rules!
      targetRulesToCreate.push(...promotionRuleAttribute(rules))

      await promotionModule.removePromotionTargetRules(data.id, data.rule_ids)
    }

    return new StepResponse(null, {
      id: data.id,
      promotionRulesToCreate,
      buyRulesToCreate,
      targetRulesToCreate,
    })
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const {
      id,
      promotionRulesToCreate = [],
      buyRulesToCreate = [],
      targetRulesToCreate = [],
    } = data

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    promotionRulesToCreate.length &&
      (await promotionModule.addPromotionRules(id, promotionRulesToCreate))

    buyRulesToCreate.length &&
      (await promotionModule.addPromotionBuyRules(id, buyRulesToCreate))

    targetRulesToCreate.length &&
      (await promotionModule.addPromotionBuyRules(id, targetRulesToCreate))
  }
)

function promotionRuleAttribute(rules: PromotionRuleDTO[]) {
  return rules.map((rule) => ({
    description: rule.description!,
    attribute: rule.attribute!,
    operator: rule.operator!,
    values: rule.values!.map((val) => val.value!),
  }))
}
