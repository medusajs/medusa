import {
  BaseCreateCustomer,
  BaseCreateCustomerAddress,
  BaseCustomer,
  BaseCustomerAddress,
  BaseCustomerAddressFilters,
  BaseCustomerFilters,
  BaseCustomerGroup,
  BaseUpdateCustomer,
  BaseUpdateCustomerAddress,
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

export interface AdminCreateCustomerAddress extends BaseCreateCustomerAddress {}
export interface AdminUpdateCustomerAddress extends BaseUpdateCustomerAddress {}
