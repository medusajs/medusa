import {
  BaseCreateCustomer,
  BaseCreateCustomerAddress,
  BaseUpdateCustomer,
  BaseUpdateCustomerAddress,
} from "../common"

export interface StoreCreateCustomer extends BaseCreateCustomer {}
export interface StoreUpdateCustomer extends Omit<BaseUpdateCustomer, "email"> {}

export interface StoreCreateCustomerAddress extends BaseCreateCustomerAddress {}
export interface StoreUpdateCustomerAddress extends BaseUpdateCustomerAddress {}
