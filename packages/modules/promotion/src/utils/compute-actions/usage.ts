import {
  BigNumberInput,
  CampaignBudgetExceededAction,
  CampaignBudgetUsageContext,
  CampaignBudgetUsageDTO,
  ComputeActionContext,
  InferEntityType,
  PromotionDTO,
} from "@medusajs/framework/types"
import {
  CampaignBudgetType,
  ComputedActions,
  MathBN,
} from "@medusajs/framework/utils"
import { Promotion } from "@models"

/**
 * Compute the action for a budget exceeded.
 * @param promotion - the promotion being applied
 * @param amount - amount can be:
 *  1. discounted amount in case of spend budget
 *  2. number of times the promotion has been used in case of usage budget
 *  3. number of times the promotion has been used by a specific attribute value in case of use_by_attribute budget
 *  4. discounted amount in case of spend_by_attribute budget
 * @param attributeUsage - the attribute usage in case of use_by_attribute or spend_by_attribute budget
 * @param budgetAllottedAmounts - the amounts already given out per budget id by earlier adjustments
 * in the same computeActions call. Updated with `amount` when a spend or spend_by_attribute adjustment fits.
 * @returns the exceeded action if the budget is exceeded, otherwise undefined
 */
export function computeActionForBudgetExceeded(
  promotion: PromotionDTO | InferEntityType<typeof Promotion>,
  amount: BigNumberInput,
  attributeUsage?: CampaignBudgetUsageDTO,
  budgetAllottedAmounts?: Map<string, BigNumberInput>
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

  const isSpendByAttribute =
    campaignBudget.type === CampaignBudgetType.SPEND_BY_ATTRIBUTE

  // A spend_by_attribute budget's own `used` is the aggregate across all
  // attribute values, so it never applies to a single attribute value.
  const campaignBudgetUsed = attributeUsage
    ? attributeUsage.used
    : isSpendByAttribute
      ? 0
      : (campaignBudget.used ?? 0)

  const isSpend =
    campaignBudget.type === CampaignBudgetType.SPEND || isSpendByAttribute
  const allottedAmount = budgetAllottedAmounts?.get(campaignBudget.id) ?? 0

  const totalUsed = isSpend
    ? MathBN.add(campaignBudgetUsed, allottedAmount, amount)
    : MathBN.add(campaignBudgetUsed, 1)

  if (campaignBudget.limit && MathBN.gt(totalUsed, campaignBudget.limit)) {
    return {
      action: ComputedActions.CAMPAIGN_BUDGET_EXCEEDED,
      code: promotion.code!,
    }
  }

  if (isSpend && budgetAllottedAmounts) {
    budgetAllottedAmounts.set(
      campaignBudget.id,
      MathBN.add(allottedAmount, amount)
    )
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
