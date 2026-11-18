import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminShippingProfile } from "./entities"

export interface AdminShippingProfileResponse {
  /**
   * The shipping profile's details.
   */
  shipping_profile: AdminShippingProfile
}

export type AdminShippingProfileListResponse = PaginatedResponse<{
  /**
   * The list of shipping profiles.
   */
  shipping_profiles: AdminShippingProfile[]
}>

export interface AdminShippingProfileDeleteResponse extends DeleteResponse<"shipping_profile"> {}
