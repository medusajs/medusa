import {
  BigNumberInput,
  CampaignBudgetExceededAction,
  PromotionDTO,
} from "@medusajs/types"
import { CampaignBudgetType, ComputedActions, MathBN } from "@medusajs/utils"

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
