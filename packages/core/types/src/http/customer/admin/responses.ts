import { DeleteResponse, DeleteResponseWithParent, PaginatedResponse } from "../../common";
import { AdminCustomer, AdminCustomerAddress, AdminCustomerGroup } from "./entities";

export interface AdminCustomerResponse {
  customer: AdminCustomer
}

export type AdminCustomerListResponse = PaginatedResponse<{ customers: AdminCustomer }>

export interface AdminCustomerGroupResponse {
  customer_group: AdminCustomerGroup
}

export type AdminCustomerGroupListResponse = PaginatedResponse<{
  customer_groups: AdminCustomerGroup[]
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