import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deletePromotionsStepId = "delete-promotions"
export const deletePromotionsStep = createStep(
  deletePromotionsStepId,
  async (ids: string[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    await promotionModule.softDelete(ids)

    return new StepResponse(null, ids)
  },
  async (idsToRestore, { container }) => {
    if (!idsToRestore) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    await promotionModule.restore(idsToRestore)
  }
)
