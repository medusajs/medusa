import {
  BaseCustomer,
  BaseCustomerAddress,
  BaseCustomerGroup,
} from "../common"

export interface AdminCustomerGroup extends BaseCustomerGroup {}
export interface AdminCustomer extends BaseCustomer {
  has_account: boolean
  groups?: AdminCustomerGroup[]
}
export interface AdminCustomerAddress extends BaseCustomerAddress {}