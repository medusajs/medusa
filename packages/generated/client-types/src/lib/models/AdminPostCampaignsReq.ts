/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { CampaignBudget } from "./CampaignBudget"

/**
 * The promotion's campaign.
 */
export interface AdminPostCampaignsReq {
  /**
   * The campaign's name.
   */
  name: string
  /**
   * The campaign's campaign identifier.
   */
  campaign_identifier?: string
  /**
   * The campaign's description.
   */
  description?: string
  /**
   * The campaign's currency.
   */
  currency?: string
  budget?: CampaignBudget
  /**
   * The campaign's starts at.
   */
  starts_at?: string
  /**
   * The campaign's ends at.
   */
  ends_at?: string
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
