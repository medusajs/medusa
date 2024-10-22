import {
  DeleteResponse,
  DeleteResponseWithParent,
  PaginatedResponse,
} from "../../common"
import { AdminCustomer, AdminCustomerAddress } from "./entities"

export interface AdminCustomerResponse {
  /**
   * The customer's details.
   */
  customer: AdminCustomer
}

export type AdminCustomerListResponse = PaginatedResponse<{
  /**
   * The list of customers.
   */
  customers: AdminCustomer[]
}>

export interface AdminCustomerAddressResponse {
  address: AdminCustomerAddress
}

export type AdminCustomerAddressListResponse = PaginatedResponse<{
  addresses: AdminCustomerAddress[]
}>

export type AdminCustomerDeleteResponse = DeleteResponse<"customer">

export type AdminCustomerGroupDeleteResponse = DeleteResponse<"customer_group">

export type AdminCustomerAddressDeleteResponse = DeleteResponseWithParent<
  "customer_address",
  AdminCustomer
>
