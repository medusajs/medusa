import {
  CreateCampaignDTO,
  IPromotionModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const createCampaignsStepId = "create-campaigns"
/**
 * This step cancels one or more campaigns.
 * 
 * @example
 * const data = createCampaignsStep([
 *   {
 *     name: "Sale Campaign",
 *     campaign_identifier: "GA-123456"
 *   }
 * ])
 */
export const createCampaignsStep = createStep(
  createCampaignsStepId,
  async (data: CreateCampaignDTO[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    const createdCampaigns = await promotionModule.createCampaigns(data)

    return new StepResponse(
      createdCampaigns,
      createdCampaigns.map((createdCampaigns) => createdCampaigns.id)
    )
  },
  async (createdCampaignIds, { container }) => {
    if (!createdCampaignIds?.length) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    await promotionModule.deleteCampaigns(createdCampaignIds)
  }
)
