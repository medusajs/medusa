import { AdminCustomerGroup } from "../../customer-group"
import { BaseCustomer, BaseCustomerAddress } from "../common"

export interface AdminCustomer extends BaseCustomer {
  has_account: boolean
  groups?: AdminCustomerGroup[]
}
export interface AdminCustomerAddress extends BaseCustomerAddress {}
