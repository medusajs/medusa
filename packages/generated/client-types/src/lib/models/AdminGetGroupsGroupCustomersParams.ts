/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetGroupsGroupCustomersParams {
  /**
   * The number of items to return.
   */
  limit?: number
  /**
   * The items to skip before result.
   */
  offset?: number
  /**
   * (Comma separated) Which fields should be expanded in each customer.
   */
  expand?: string
  /**
   * a search term to search email, first_name, and last_name.
   */
  q?: string
}
