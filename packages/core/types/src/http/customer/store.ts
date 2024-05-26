import {
  BaseCreateCustomer,
  BaseCreateCustomerAddress,
  BaseCustomer,
  BaseCustomerAddress,
  BaseCustomerAddressFilters,
  BaseCustomerFilters,
  BaseUpdateCustomer,
  BaseUpdateCustomerAddress,
} from "./common"

export interface StoreCustomer extends BaseCustomer {}
export interface StoreCustomerAddress extends BaseCustomerAddress {}
export interface StoreCustomerFilters extends BaseCustomerFilters {}
export interface StoreCustomerAddressFilters
  extends BaseCustomerAddressFilters {}

export interface StoreCreateCustomer extends BaseCreateCustomer {}
export interface StoreUpdateCustomer extends BaseUpdateCustomer {}

export interface StoreCreateCustomerAddress extends BaseCreateCustomerAddress {}
export interface StoreUpdateCustomerAddress extends BaseUpdateCustomerAddress {}
