import { CampaignBudgetTypeValues } from "../../../promotion"

export interface AdminCreateCampaign {
  /**
   * The campaign's name.
   */
  name?: string
  /**
   * The campaign's description.
   */
  description?: string
  /**
   * The campaign's currency code.
   * 
   * @example
   * usd
   */
  currency?: string | null
  /**
   * The campaign's identifier.
   */
  campaign_identifier?: string
  /**
   * The date the campaign and its promotions start at.
   */
  starts_at?: Date | null
  /**
   * The date the campaign and its promotions end at.
   */
  ends_at?: Date | null
  /**
   * The campaign's budget.
   */
  budget?: {
    /**
     * The budget's type. `spend` means the limit is set on the total amount discounted by the campaign's promotions; 
     * `usage` means the limit is set on the total number of times the campaign's promotions can be used.
     */
    type?: CampaignBudgetTypeValues
    /**
     * The budget's currency code.
     * 
     * @example
     * usd
     */
    currency_code?: string | null
    /**
     * The budget's limit.
     */
    limit?: number | null
  } | null
}

export interface AdminUpdateCampaign {
  /**
   * The campaign's name.
   */
  name?: string
  /**
   * The campaign's description.
   */
  description?: string
  /**
   * The campaign's currency code.
   * 
   * @example
   * usd
   */
  currency?: string | null
  /**
   * The campaign's identifier.
   */
  campaign_identifier?: string
  /**
   * The date the campaign and its promotions start at.
   */
  starts_at?: Date | null
  /**
   * The date the campaign and its promotions end at.
   */
  ends_at?: Date | null
  /**
   * The campaign's budget.
   */
  budget?: {
    /**
     * The budget's type. `spend` means the limit is set on the total amount discounted by the campaign's promotions; 
     * `usage` means the limit is set on the total number of times the campaign's promotions can be used.
     */
    type?: CampaignBudgetTypeValues
    /**
     * The budget's currency code.
     * 
     * @example
     * usd
     */
    currency_code?: string | null
    /**
     * The budget's limit.
     */
    limit?: number | null
  } | null
}
