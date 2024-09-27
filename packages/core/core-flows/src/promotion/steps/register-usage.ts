import {
  IPromotionModuleService,
  UsageComputedActions,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

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
      Modules.PROMOTION
    )

    await promotionModule.registerUsage(data)

    return new StepResponse(null, data)
  },
  async (revertData, { container }) => {
    if (!revertData?.length) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    await promotionModule.revertUsage(revertData)
  }
)
