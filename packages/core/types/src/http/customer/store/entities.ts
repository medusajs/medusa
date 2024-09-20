import {
  BaseCustomer,
  BaseCustomerAddress,
} from "../common"

export interface StoreCustomer extends BaseCustomer {
  addresses: StoreCustomerAddress[]
}
export interface StoreCustomerAddress extends BaseCustomerAddress {}