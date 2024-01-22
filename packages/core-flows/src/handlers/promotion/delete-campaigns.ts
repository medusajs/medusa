import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteCampaignsStepId = "delete-campaigns"
export const deleteCampaignsStep = createStep(
  deleteCampaignsStepId,
  async (ids: string[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    await promotionModule.softDeleteCampaigns(ids)

    return new StepResponse(null, ids)
  },
  async (idsToRestore, { container }) => {
    if (!idsToRestore) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    await promotionModule.restoreCampaigns(idsToRestore)
  }
)
