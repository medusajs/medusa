import { CampaignBudgetTypeValues, PromotionDTO } from "./common"

/**
 * The campaign budget to be created.
 */
export interface CreateCampaignBudgetDTO {
  /**
   * The type of the campaign budget.
   */
  type: CampaignBudgetTypeValues

  /**
   * The limit of the campaign budget.
   */
  limit: number | null

  /**
   * How much is used of the campaign budget.
   */
  used?: number
}

/**
 * The attributes to update in the campaign budget.
 */
export interface UpdateCampaignBudgetDTO {
  /**
   * The ID of the campaign budget.
   */
  id: string

  /**
   * The type of the campaign budget.
   */
  type?: CampaignBudgetTypeValues

  /**
   * The limit of the campaign budget.
   */
  limit?: number | null

  /**
   * How much is used of the campaign budget.
   */
  used?: number
}

/**
 * The campaign to be created.
 */
export interface CreateCampaignDTO {
  /**
   * The name of the campaign.
   */
  name: string

  /**
   * The description of the campaign.
   */
  description?: string

  /**
   * The currency of the campaign.
   */
  currency?: string

  /**
   * The campaign identifier of the campaign.
   */
  campaign_identifier: string

  /**
   * The start date of the campaign.
   */
  starts_at: Date

  /**
   * The end date of the campaign.
   */
  ends_at: Date

  /**
   * The associated campaign budget.
   */
  budget?: CreateCampaignBudgetDTO

  /**
   * The promotions of the campaign.
   */
  promotions?: Pick<PromotionDTO, "id">[]
}

/**
 * The attributes to update in the campaign.
 */
export interface UpdateCampaignDTO {
  /**
   * The ID of the campaign.
   */
  id: string

  /**
   * The name of the campaign.
   */
  name?: string

  /**
   * The description of the campaign.
   */
  description?: string

  /**
   * The currency of the campaign.
   */
  currency?: string

  /**
   * The campaign identifier of the campaign.
   */
  campaign_identifier?: string

  /**
   * The start date of the campaign.
   */
  starts_at?: Date

  /**
   * The end date of the campaign.
   */
  ends_at?: Date

  /**
   * The budget of the campaign.
   */
  budget?: Omit<UpdateCampaignBudgetDTO, "id">

  /**
   * The promotions of the campaign.
   */
  promotions?: Pick<PromotionDTO, "id">[]
}
