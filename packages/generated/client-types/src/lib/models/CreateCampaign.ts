/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { CreateCampaignBudget } from "./CreateCampaignBudget"

/**
 * The promotion's campaign.
 */
export interface CreateCampaign {
  /**
   * The campaign's name.
   */
  name: string
  /**
   * The campaign's description.
   */
  description?: string
  /**
   * The campaign's currency.
   */
  currency?: string
  /**
   * The campaign's campaign identifier.
   */
  campaign_identifier: string
  /**
   * The campaign's starts at.
   */
  starts_at: string
  /**
   * The campaign's ends at.
   */
  ends_at: string
  budget?: CreateCampaignBudget
  /**
   * The campaign's promotions.
   */
  promotions?: Array<{
    /**
     * The promotion's ID.
     */
    id: string
  }>
}
