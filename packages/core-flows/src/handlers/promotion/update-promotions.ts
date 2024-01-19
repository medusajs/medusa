import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService, UpdatePromotionDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updatePromotionsStep = createStep(
  "update-promotions",
  async (data: UpdatePromotionDTO[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    const updatedPromotions = await promotionModule.update(data)

    return new StepResponse(
      updatedPromotions,
      updatedPromotions.map((updatedPromotions) => updatedPromotions.id)
    )
  },
  async (updatedPromotionIds, { container }) => {
    if (!updatedPromotionIds?.length) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    await promotionModule.delete(updatedPromotionIds)
  }
)
