import {
  BaseCustomerAddressFilters,
  BaseCustomerFilters,
  CustomerGroupInCustomerFilters,
} from "../common"

export interface AdminCustomerFilters extends BaseCustomerFilters {
  groups?: CustomerGroupInCustomerFilters | string[] | string
  has_account?: boolean
}
export interface AdminCustomerAddressFilters
  extends BaseCustomerAddressFilters {}
