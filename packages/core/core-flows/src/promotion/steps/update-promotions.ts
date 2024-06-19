import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService, UpdatePromotionDTO } from "@medusajs/types"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updatePromotionsStepId = "update-promotions"
export const updatePromotionsStep = createStep(
  updatePromotionsStepId,
  async (data: UpdatePromotionDTO[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)
    const dataBeforeUpdate = await promotionModule.listPromotions(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updatedPromotions = await promotionModule.updatePromotions(data)

    return new StepResponse(updatedPromotions, {
      dataBeforeUpdate,
      selects,
      relations,
    })
  },
  async (revertInput, { container }) => {
    if (!revertInput) {
      return
    }

    const { dataBeforeUpdate, selects, relations } = revertInput

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    await promotionModule.updatePromotions(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      )
    )
  }
)
