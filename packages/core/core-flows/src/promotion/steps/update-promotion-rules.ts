import {
  IPromotionModuleService,
  UpdatePromotionRulesWorkflowDTO,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updatePromotionRulesStepId = "update-promotion-rules"
export const updatePromotionRulesStep = createStep(
  updatePromotionRulesStepId,
  async (input: UpdatePromotionRulesWorkflowDTO, { container }) => {
    const { data } = input

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
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
      ModuleRegistrationName.PROMOTION
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
