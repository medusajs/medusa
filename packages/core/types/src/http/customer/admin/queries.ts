import {
  BaseCustomerAddressFilters,
  BaseCustomerFilters,
  CustomerGroupInCustomerFilters,
} from "../common"

export interface AdminCustomerFilters extends BaseCustomerFilters {
  groups: CustomerGroupInCustomerFilters | string[] | string
}
export interface AdminCustomerAddressFilters
  extends BaseCustomerAddressFilters {}
