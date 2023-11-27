/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetCustomersParams {
  /**
   * The number of customers to return.
   */
  limit?: number
  /**
   * The number of customers to skip when retrieving the customers.
   */
  offset?: number
  /**
   * Comma-separated relations that should be expanded in the returned customer.
   */
  expand?: string
  /**
   * term to search customers' email, first_name, and last_name fields.
   */
  q?: string
  /**
   * Filter by customer group IDs.
   */
  groups?: Array<string>
}
