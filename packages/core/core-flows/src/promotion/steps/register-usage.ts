import { IPromotionModuleService, UsageComputedActions } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const registerUsageStepId = "register-usage"
/**
 * This step registers usage for promotion campaigns
 */
export const registerUsageStep = createStep(
  registerUsageStepId,
  async (data: UsageComputedActions[], { container }) => {
    if (!data.length) {
      return new StepResponse(null, [])
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    await promotionModule.registerUsage(data)

    return new StepResponse(null, data)
  },
  async (revertData, { container }) => {
    if (!revertData?.length) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    await promotionModule.revertUsage(revertData)
  }
)
