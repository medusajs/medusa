import {
  IPromotionModuleService,
  UpdatePromotionRulesWorkflowDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const updatePromotionRulesStepId = "update-promotion-rules"
/**
 * This step updates one or more promotion rules.
 */
export const updatePromotionRulesStep = createStep(
  updatePromotionRulesStepId,
  async (input: UpdatePromotionRulesWorkflowDTO, { container }) => {
    const { data } = input

    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    const promotionRulesBeforeUpdate = await promotionModule.listPromotionRules(
      { id: data.map((d) => d.id) },
      { relations: ["values"] }
    )

    const updatedPromotionRules = await promotionModule.updatePromotionRules(
      data
    )

    return new StepResponse(updatedPromotionRules, promotionRulesBeforeUpdate)
  },
  async (updatedPromotionRules, { container }) => {
    if (!updatedPromotionRules?.length) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    await promotionModule.updatePromotionRules(
      updatedPromotionRules.map((rule) => ({
        id: rule.id,
        description: rule.description,
        attribute: rule.attribute,
        operator: rule.operator,
        values: rule.values.map((v) => v.value!),
      }))
    )
  }
)
