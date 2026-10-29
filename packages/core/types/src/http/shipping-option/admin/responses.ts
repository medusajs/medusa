import { BatchResponse, DeleteResponse, PaginatedResponse } from "../../common"
import {
  AdminShippingOption,
  AdminShippingOptionRule,
  AdminShippingOptionType,
} from "./entities"

export interface AdminShippingOptionResponse {
  /**
   * The shipping option's details.
   */
  shipping_option: AdminShippingOption
}

export type AdminShippingOptionListResponse = PaginatedResponse<{
  /**
   * The list of shipping options.
   */
  shipping_options: AdminShippingOption[]
}>

export interface AdminShippingOptionDeleteResponse extends DeleteResponse<"shipping_option"> {}

export type AdminUpdateShippingOptionRulesResponse =
  BatchResponse<AdminShippingOptionRule>

export interface AdminShippingOptionTypeResponse {
  /**
   * The shipping option type's details.
   */
  shipping_option_type: AdminShippingOptionType
}

export interface AdminShippingOptionTypeListResponse extends PaginatedResponse<{
  /**
   * The list of shipping option types.
   */
  shipping_option_types: AdminShippingOptionType[]
}> {}

export interface AdminShippingOptionTypeDeleteResponse extends DeleteResponse<"shipping_option_type"> {}
