import { DeleteResponse, PaginatedResponse } from "../../common"

export interface ShippingProfileResponse {
  id: string
  name: string
  type: string
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface AdminShippingProfileResponse {
  shipping_profile: ShippingProfileResponse
}

export type AdminShippingProfilesResponse = PaginatedResponse<{
  shipping_profiles: ShippingProfileResponse[]
}>

export interface AdminShippingProfileDeleteResponse
  extends DeleteResponse<"shipping_profile"> {}
