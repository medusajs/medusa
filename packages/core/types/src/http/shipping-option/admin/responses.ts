import { BatchResponse, DeleteResponse, PaginatedResponse } from "../../common"
import { AdminShippingOption, AdminShippingOptionRule } from "./entities"

export interface AdminShippingOptionResponse {
  shipping_option: AdminShippingOption
}

export type AdminShippingOptionListResponse = PaginatedResponse<{
  shipping_options: AdminShippingOption[]
}>

export interface AdminShippingOptionDeleteResponse
  extends DeleteResponse<"shipping_option"> {}

export type AdminUpdateShippingOptionRulesResponse =
  BatchResponse<AdminShippingOptionRule>
