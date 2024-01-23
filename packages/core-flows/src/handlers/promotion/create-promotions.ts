import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreatePromotionDTO, IPromotionModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createPromotionsStepId = "create-promotions"
export const createPromotionsStep = createStep(
  createPromotionsStepId,
  async (data: CreatePromotionDTO[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    const createdPromotions = await promotionModule.create(data)

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
      ModuleRegistrationName.PROMOTION
    )

    await promotionModule.delete(createdPromotionIds)
  }
)
