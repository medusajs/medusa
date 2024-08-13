import { PaginatedResponse } from "../../common";
import { StoreCustomer, StoreCustomerAddress } from "./entities";

export interface StoreCustomerResponse {
  customer: StoreCustomer
}

export interface StoreCustomerAddressResponse {
  address: StoreCustomerAddress
}

export interface StoreCustomerAddressListResponse
  extends PaginatedResponse<{ addresses: StoreCustomerAddress[] }> {}
