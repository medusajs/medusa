import {
  BaseCreateCustomer,
  BaseCreateCustomerAddress,
  BaseUpdateCustomer,
  BaseUpdateCustomerAddress,
} from "../common"

export interface AdminCreateCustomer extends BaseCreateCustomer {}
export interface AdminUpdateCustomer extends BaseUpdateCustomer {}

export interface AdminCreateCustomerAddress extends BaseCreateCustomerAddress {}
export interface AdminUpdateCustomerAddress extends BaseUpdateCustomerAddress {}
