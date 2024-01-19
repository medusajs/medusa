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

    return new StepResponse(updatedPromotions, data)
  },
  async (dataBeforeUpdate, { container }) => {
    // TODO: reset the data before an update was performed
  }
)
