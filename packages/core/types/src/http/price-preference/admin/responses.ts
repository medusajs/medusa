import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminPricePreference } from "./entities"

export interface AdminPricePreferenceResponse {
  /**
   * The price preference's details.
   */
  price_preference: AdminPricePreference
}

export interface AdminPricePreferenceListResponse
  extends PaginatedResponse<{
    /**
     * The list of price preferences.
     */
    price_preferences: AdminPricePreference[]
  }> {}

export interface AdminPricePreferenceDeleteResponse
  extends DeleteResponse<"price_preference"> {}
