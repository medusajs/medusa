import { BaseCustomer, BaseCustomerAddress } from "../common"

export interface StoreCustomer extends Omit<BaseCustomer, "created_by"> {
  addresses: StoreCustomerAddress[]
}
export interface StoreCustomerAddress extends BaseCustomerAddress {}
