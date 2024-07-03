import { IPromotionModuleService, UpdateCampaignDTO } from "@medusajs/types"
import {
  ModuleRegistrationName,
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateCampaignsStepId = "update-campaigns"
export const updateCampaignsStep = createStep(
  updateCampaignsStepId,
  async (data: UpdateCampaignDTO[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)
    const dataBeforeUpdate = await promotionModule.listCampaigns(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updatedCampaigns = await promotionModule.updateCampaigns(data)

    return new StepResponse(updatedCampaigns, {
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

    await promotionModule.updateCampaigns(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      )
    )
  }
)
