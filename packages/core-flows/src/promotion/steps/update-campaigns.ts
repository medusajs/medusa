import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService, UpdateCampaignDTO } from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
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

    return new StepResponse(updatedCampaigns, dataBeforeUpdate)
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
    await promotionModule.updateCampaigns(dataBeforeUpdate)
  }
)
