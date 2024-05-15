/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The campaign's budget.
 */
export interface CreateCampaignBudget {
  type: "spend" | "usage"
  /**
   * The budget's limit.
   */
  limit: number
  /**
   * The budget's used.
   */
  used?: number
}
