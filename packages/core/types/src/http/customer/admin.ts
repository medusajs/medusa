import {
  BaseCreateCustomer,
  BaseCustomer,
  BaseCustomerAddress,
  BaseCustomerAddressFilters,
  BaseCustomerFilters,
  BaseCustomerGroup,
  BaseUpdateCustomer,
  CustomerGroupInCustomerFilters,
} from "./common"

export interface AdminCustomerGroup extends BaseCustomerGroup {}
export interface AdminCustomer extends BaseCustomer {
  has_account: boolean
  groups?: AdminCustomerGroup[]
}
export interface AdminCustomerAddress extends BaseCustomerAddress {}
export interface AdminCustomerFilters extends BaseCustomerFilters {
  groups: CustomerGroupInCustomerFilters | string[] | string
}
export interface AdminCustomerAddressFilters
  extends BaseCustomerAddressFilters {}

export interface AdminCreateCustomer extends BaseCreateCustomer {}
export interface AdminUpdateCustomer extends BaseUpdateCustomer {}
