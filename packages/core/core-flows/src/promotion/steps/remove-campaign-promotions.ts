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

export const removeCampaignPromotionsStepId = "remove-campaign-promotions"
/**
 * This step removes promotions from a campaigns.
 * 
 * @example
 * const data = removeCampaignPromotionsStep([
 *   {
 *     id: "camp_123",
 *     remove: ["promo_321"]
 *   }
 * ])
 */
export const removeCampaignPromotionsStep = createStep(
  removeCampaignPromotionsStepId,
  async (input: WorkflowData<LinkWorkflowInput>, { container }) => {
    const { id: campaignId, remove: promotionIdsToRemove = [] } = input
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    if (promotionIdsToRemove.length) {
      await promotionModule.removePromotionsFromCampaign({
        id: campaignId,
        promotion_ids: promotionIdsToRemove,
      })
    }

    return new StepResponse(promotionIdsToRemove, input)
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const { id: campaignId, remove: promotionIdsToAdd = [] } = data
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    if (promotionIdsToAdd.length) {
      await promotionModule.addPromotionsToCampaign({
        id: campaignId,
        promotion_ids: promotionIdsToAdd,
      })
    }
  }
)
