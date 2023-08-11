/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetGroupsGroupCustomersParams {
  /**
   * The number of customers to return.
   */
  limit?: number
  /**
   * The number of customers to skip when retrieving the customers.
   */
  offset?: number
  /**
   * Comma-separated relations that should be expanded in the returned customers.
   */
  expand?: string
  /**
   * a term to search customers by email, first_name, and last_name.
   */
  q?: string
}
