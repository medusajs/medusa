import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService, LinkWorkflowInput } from "@medusajs/types"
import { StepResponse, WorkflowData, createStep } from "@medusajs/workflows-sdk"

export const removeCampaignPromotionsStepId = "remove-campaign-promotions"
export const removeCampaignPromotionsStep = createStep(
  removeCampaignPromotionsStepId,
  async (input: WorkflowData<LinkWorkflowInput>, { container }) => {
    const { id: campaignId, remove: promotionIdsToRemove = [] } = input
    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
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
      ModuleRegistrationName.PROMOTION
    )

    if (promotionIdsToAdd.length) {
      await promotionModule.addPromotionsToCampaign({
        id: campaignId,
        promotion_ids: promotionIdsToAdd,
      })
    }
  }
)
