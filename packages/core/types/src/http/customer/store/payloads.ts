import {
  BaseCreateCustomer,
  BaseCreateCustomerAddress,
  BaseUpdateCustomer,
  BaseUpdateCustomerAddress,
} from "../common"

export interface StoreCreateCustomer extends BaseCreateCustomer {}
export interface StoreUpdateCustomer extends BaseUpdateCustomer {}

export interface StoreCreateCustomerAddress extends BaseCreateCustomerAddress {}
export interface StoreUpdateCustomerAddress extends BaseUpdateCustomerAddress {}
