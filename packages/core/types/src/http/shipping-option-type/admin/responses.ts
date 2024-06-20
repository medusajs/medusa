import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminShippingOptionType } from "./entities"

export interface AdminShippingOptionTypeResponse {
  shipping_option_type: AdminShippingOptionType
}

export type AdminShippingOptionTypeListResponse = PaginatedResponse<{
  shipping_option_types: AdminShippingOptionType[]
}>

export interface AdminShippingOptionTypeDeleteResponse
  extends DeleteResponse<"shipping_option_type"> {}
