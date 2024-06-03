import {
  BigNumberInput,
  CampaignBudgetExceededAction,
  ComputeActions,
  PromotionDTO,
} from "@medusajs/types"
import { CampaignBudgetType, ComputedActions, MathBN } from "@medusajs/utils"

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
  amount: BigNumberInput
): CampaignBudgetExceededAction | void {
  const campaignBudget = promotion.campaign?.budget

  if (!campaignBudget) {
    return
  }

  const campaignBudgetUsed = campaignBudget.used ?? 0
  const totalUsed =
    campaignBudget.type === CampaignBudgetType.SPEND
      ? MathBN.add(campaignBudgetUsed, amount)
      : MathBN.add(campaignBudgetUsed, 1)

  if (campaignBudget.limit && MathBN.gt(totalUsed, campaignBudget.limit)) {
    return {
      action: ComputedActions.CAMPAIGN_BUDGET_EXCEEDED,
      code: promotion.code!,
    }
  }
}
