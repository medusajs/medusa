import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminCustomerInGroupFilters {
  /**
   * Filter by customer ID(s).
   */
  id?: string | string[]
  /**
   * Filter by email(s).
   */
  email?: string | string[] | OperatorMap<string>
  /**
   * Filter by IDs of default billing addresses to retrieve 
   * their associated customers.
   */
  default_billing_address_id?: string | string[]
  /**
   * Filter by IDs of default shipping addresses to retrieve 
   * their associated customers.
   */
  default_shipping_address_id?: string | string[]
  /**
   * Filter by company name(s).
   */
  company_name?: string | string[]
  /**
   * Filter by first name(s).
   */
  first_name?: string | string[]
  /**
   * Filter by last name(s).
   */
  last_name?: string | string[]
  /**
   * Filter by user IDs to retrieve the customers they created.
   */
  created_by?: string | string[]
  /**
   * Apply filters on the customer's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the customer's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the customer's deletion date.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminGetCustomerGroupsParams
  extends FindParams,
    BaseFilterable<AdminGetCustomerGroupsParams> {
  /**
   * Query or keywords to search the customer group's searchable fields.
   */
  q?: string
  /**
   * Filter by customer group ID(s).
   */
  id?: string | string[]
  /**
   * Filter by name(s).
   */
  name?: string | string[]
  /**
   * Filter by customers to retrieve their associated groups.
   */
  customers?: string | string[] | AdminCustomerInGroupFilters
  /**
   * Filter by IDs of users to retrieve the groups they created.
   */
  created_by?: string | string[]
  /**
   * Apply filters on the group's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the group's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the group's deletion date.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminGetCustomerGroupParams extends SelectParams {}
