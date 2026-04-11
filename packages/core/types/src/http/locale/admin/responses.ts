import { PaginatedResponse } from "../../common"
import { AdminLocale } from "./entities"

export interface AdminLocaleResponse {
  /**
   * The locale's details.
   */
  locale: AdminLocale
}

export interface AdminLocaleListResponse
  extends PaginatedResponse<{
    /**
     * The list of locales.
     */
    locales: AdminLocale[]
  }> {}
