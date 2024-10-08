import {
  CreatePromotionDTO,
  IPromotionModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createPromotionsStepId = "create-promotions"
/**
 * This step creates one or more promotions.
 */
export const createPromotionsStep = createStep(
  createPromotionsStepId,
  async (data: CreatePromotionDTO[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    const createdPromotions = await promotionModule.createPromotions(data)

    return new StepResponse(
      createdPromotions,
      createdPromotions.map((createdPromotions) => createdPromotions.id)
    )
  },
  async (createdPromotionIds, { container }) => {
    if (!createdPromotionIds?.length) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    await promotionModule.deletePromotions(createdPromotionIds)
  }
)
