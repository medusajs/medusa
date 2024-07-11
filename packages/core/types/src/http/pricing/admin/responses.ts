import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminPricePreference } from "./entities"

export interface AdminPricePreferenceResponse {
  price_preference: AdminPricePreference
}

export interface AdminPricePreferenceListResponse
  extends PaginatedResponse<{
    price_preferences: AdminPricePreference[]
  }> {}

export interface AdminPricePreferenceDeleteResponse
  extends DeleteResponse<"price_preference"> {}
