import {
  BigNumberInput,
  CampaignBudgetExceededAction,
  CampaignBudgetUsageContext,
  CampaignBudgetUsageDTO,
  ComputeActionContext,
  InferEntityType,
  PromotionDTO,
} from "@zjedene-medusa/framework/types"
import {
  CampaignBudgetType,
  ComputedActions,
  MathBN,
} from "@zjedene-medusa/framework/utils"
import { Promotion } from "@models"

/**
 * Compute the action for a budget exceeded.
 * @param promotion - the promotion being applied
 * @param amount - amount can be:
 *  1. discounted amount in case of spend budget
 *  2. number of times the promotion has been used in case of usage budget
 *  3. number of times the promotion has been used by a specific attribute value in case of use_by_attribute budget
 * @param attributeUsage - the attribute usage in case of use_by_attribute budget
 * @returns the exceeded action if the budget is exceeded, otherwise undefined
 */
export function computeActionForBudgetExceeded(
  promotion: PromotionDTO | InferEntityType<typeof Promotion>,
  amount: BigNumberInput,
  attributeUsage?: CampaignBudgetUsageDTO
): CampaignBudgetExceededAction | void {
  const campaignBudget = promotion.campaign?.budget

  if (!campaignBudget) {
    return
  }

  if (
    campaignBudget.type === CampaignBudgetType.USE_BY_ATTRIBUTE &&
    !attributeUsage
  ) {
    return
  }

  const campaignBudgetUsed = attributeUsage
    ? attributeUsage.used
    : campaignBudget.used ?? 0

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

export function getBudgetUsageContextFromComputeActionContext(
  computeActionContext: ComputeActionContext
): CampaignBudgetUsageContext {
  return {
    customer_id:
      computeActionContext.customer_id ??
      (computeActionContext.customer as any)?.id ??
      null,
    customer_email:
      (computeActionContext.email as string | undefined | null) ?? null,
  }
}
