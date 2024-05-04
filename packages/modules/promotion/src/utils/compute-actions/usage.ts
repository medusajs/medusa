import {
  CampaignBudgetExceededAction,
  ComputeActions,
  PromotionDTO,
} from "@medusajs/types"
import { CampaignBudgetType, ComputedActions } from "@medusajs/utils"

export function canRegisterUsage(computedAction: ComputeActions): boolean {
  return (
    [
      ComputedActions.ADD_ITEM_ADJUSTMENT,
      ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT,
    ] as string[]
  ).includes(computedAction.action)
}

export function computeActionForBudgetExceeded(
  promotion: PromotionDTO,
  amount: number
): CampaignBudgetExceededAction | void {
  const campaignBudget = promotion.campaign?.budget

  if (!campaignBudget) {
    return
  }

  const campaignBudgetUsed = campaignBudget.used ?? 0
  const totalUsed =
    campaignBudget.type === CampaignBudgetType.SPEND
      ? campaignBudgetUsed + amount
      : campaignBudgetUsed + 1

  if (campaignBudget.limit && totalUsed > campaignBudget.limit) {
    return {
      action: ComputedActions.CAMPAIGN_BUDGET_EXCEEDED,
      code: promotion.code!,
    }
  }
}
