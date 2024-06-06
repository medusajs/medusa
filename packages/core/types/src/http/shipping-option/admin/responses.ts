import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminShippingOption, AdminShippingOptionRule } from "./entities"

export interface AdminShippingOptionResponse {
  shipping_option: AdminShippingOption
}

export type AdminShippingOptionListResponse = PaginatedResponse<{
  shipping_options: AdminShippingOption[]
}>

export interface AdminShippingOptionDeleteResponse
  extends DeleteResponse<"shipping_option"> {}

export interface AdminUpdateShippingOptionRulesResponse {
  created: AdminShippingOptionRule[]
  updated: AdminShippingOptionRule[]
  deleted: {
    ids: string[]
    object: "shipping_option_rule"
    deleted: boolean
  }
}
