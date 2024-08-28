import { PaginatedResponse } from "../../common"
import { AdminCustomer, AdminCustomerAddress } from "./entities"

export interface AdminCustomerResponse {
  customer: AdminCustomer
}

export type AdminCustomerListResponse = PaginatedResponse<{
  customers: AdminCustomer
}>

export interface AdminCustomerAddressResponse {
  address: AdminCustomerAddress
}

export type AdminCustomerAddressListResponse = PaginatedResponse<{
  addresses: AdminCustomerAddress[]
}>
