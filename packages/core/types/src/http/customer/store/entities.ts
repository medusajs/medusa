import { BaseCustomer, BaseCustomerAddress } from "../common"

export interface StoreCustomer extends Omit<BaseCustomer, "created_by"> {
  /**
   * The customer's address.
   */
  addresses: StoreCustomerAddress[]
}
export interface StoreCustomerAddress extends BaseCustomerAddress {}
