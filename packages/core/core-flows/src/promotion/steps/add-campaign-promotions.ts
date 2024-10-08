import {
  IPromotionModuleService,
  LinkWorkflowInput,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  StepResponse,
  WorkflowData,
  createStep,
} from "@medusajs/framework/workflows-sdk"

export const addCampaignPromotionsStepId = "add-campaign-promotions"
/**
 * This step adds promotions to a campaign.
 */
export const addCampaignPromotionsStep = createStep(
  addCampaignPromotionsStepId,
  async (input: WorkflowData<LinkWorkflowInput>, { container }) => {
    const { id: campaignId, add: promotionIdsToAdd = [] } = input

    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    if (promotionIdsToAdd.length) {
      await promotionModule.addPromotionsToCampaign({
        id: campaignId,
        promotion_ids: promotionIdsToAdd,
      })
    }

    return new StepResponse(null, input)
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const { id: campaignId, add: promotionIdsToRemove = [] } = data
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    if (promotionIdsToRemove.length) {
      await promotionModule.removePromotionsFromCampaign({
        id: campaignId,
        promotion_ids: promotionIdsToRemove,
      })
    }
  }
)
