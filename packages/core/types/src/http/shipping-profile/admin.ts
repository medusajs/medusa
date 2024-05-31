import { BaseSoftDeletableHttpEntity } from "../base"
import { DeleteResponse, PaginatedResponse } from "../common"

export interface AdminShippingProfile extends BaseSoftDeletableHttpEntity {
  name: string
  type: string
}

export interface AdminShippingProfileResponse {
  shipping_profile: AdminShippingProfile
}

export interface AdminShippingProfileListResponse
  extends PaginatedResponse<{
    shipping_profiles: AdminShippingProfile[]
  }> {}

export interface AdminShippingProfileDeleteResponse
  extends DeleteResponse<"shipping_profile"> {}
