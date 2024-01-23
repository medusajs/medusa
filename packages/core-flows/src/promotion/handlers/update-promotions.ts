import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService, UpdatePromotionDTO } from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updatePromotionsStepId = "update-promotions"
export const updatePromotionsStep = createStep(
  updatePromotionsStepId,
  async (data: UpdatePromotionDTO[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)
    const dataBeforeUpdate = await promotionModule.list(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updatedPromotions = await promotionModule.update(data)

    return new StepResponse(updatedPromotions, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    // TODO: This still requires some sanitation of data and transformation of
    // shapes for manytomany and oneToMany relations. Create a common util.
    await promotionModule.update(dataBeforeUpdate)
  }
)
