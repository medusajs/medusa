import {
  BaseCustomerAddressFilters,
  BaseCustomerFilters,
  CustomerGroupInCustomerFilters,
} from "../common"

export interface AdminCustomerFilters extends BaseCustomerFilters {
  /**
   * Apply customer group filters to retrieve their customers.
   */
  groups?: CustomerGroupInCustomerFilters | string[] | string
  /**
   * Filter by whether the customer is registered.
   */
  has_account?: boolean
}
export interface AdminCustomerAddressFilters
  extends BaseCustomerAddressFilters {}
