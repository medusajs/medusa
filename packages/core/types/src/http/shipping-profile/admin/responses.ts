import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminShippingProfile } from "./entities"

export interface AdminShippingProfileResponse {
  shipping_profile: AdminShippingProfile
}

export type AdminShippingProfileListResponse = PaginatedResponse<{
  shipping_profiles: AdminShippingProfile[]
}>

export interface AdminShippingProfileDeleteResponse
  extends DeleteResponse<"shipping_profile"> {}
