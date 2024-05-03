import { BaseFilterable } from "../../dal"

/**
 * The campaign budget's possible types.
 */
export type CampaignBudgetTypeValues = "spend" | "usage"

/**
 * The campaign budget details.
 */
export interface CampaignBudgetDTO {
  /**
   * The ID of the campaign budget.
   */
  id: string

  /**
   * The type of the campaign budget:
   *
   * - `spend` indicates that the budget is limited by the amount discounted by the promotions in the associated campaign.
   * - `usage` indicates that the budget is limited by the number of times the promotions of the associated campaign have been used.
   *
   */
  type?: CampaignBudgetTypeValues

  /**
   * The limit of the campaign budget.
   */
  limit?: number | null

  /**
   * The usage from the campaign budget's limit:
   *
   * - If the budget's type is `spend`, the value of this attribute is the amount discounted so far by the promotions in the associated campaign.
   * - If the budget's type is `usage`, the value of this attribute is the number of times the promotions of the associated campaign have been used so far.
   *
   */
  used?: number
}

/**
 * The filters to apply on the retrieved campaign budgets.
 */
export interface FilterableCampaignBudgetProps
  extends BaseFilterable<FilterableCampaignBudgetProps> {
  /**
   * The IDs to filter the campaign budgets by.
   */
  id?: string[]

  /**
   * Filters the campaign budgets by their type.
   */
  type?: string[]
}
