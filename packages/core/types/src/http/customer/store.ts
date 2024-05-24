import {
  BaseCreateCustomer,
  BaseCustomer,
  BaseCustomerAddress,
  BaseCustomerAddressFilters,
  BaseCustomerFilters,
  BaseUpdateCustomer,
} from "./common"

export interface StoreCustomer extends BaseCustomer {}
export interface StoreCustomerAddress extends BaseCustomerAddress {}
export interface StoreCustomerFilters extends BaseCustomerFilters {}
export interface StoreCustomerAddressFilters
  extends BaseCustomerAddressFilters {}

export interface StoreCreateCustomer extends BaseCreateCustomer {}
export interface StoreUpdateCustomer extends BaseUpdateCustomer {}
