import {
  CreatePromotionDTO,
  IPromotionModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const createPromotionsStepId = "create-promotions"
/**
 * This step creates one or more promotions.
 * 
 * @example
 * const data = createPromotionsStep([
 *   {
 *     code: "10OFF",
 *     type: "standard",
 *     application_method: {
 *       type: "percentage",
 *       value: 10,
 *       target_type: "items"
 *     }
 *   }
 * ])
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
