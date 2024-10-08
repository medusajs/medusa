import {
  IPromotionModuleService,
  UpdateCampaignDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const updateCampaignsStepId = "update-campaigns"
/**
 * This step updates one or more campaigns.
 */
export const updateCampaignsStep = createStep(
  updateCampaignsStepId,
  async (data: UpdateCampaignDTO[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
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
      Modules.PROMOTION
    )

    await promotionModule.updateCampaigns(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      )
    )
  }
)
