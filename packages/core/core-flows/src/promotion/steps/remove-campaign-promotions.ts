import {
  IPromotionModuleService,
  LinkWorkflowInput,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import {
  StepResponse,
  WorkflowData,
  createStep,
} from "@zjedene-medusa/framework/workflows-sdk"

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

    return new StepResponse(null, input)
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
