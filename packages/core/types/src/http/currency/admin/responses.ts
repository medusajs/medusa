import { PaginatedResponse } from "../../common"
import { AdminCurrency } from "./entities"

export interface AdminCurrencyResponse {
  /**
   * The currency's details.
   */
  currency: AdminCurrency
}

export interface AdminCurrencyListResponse
  extends PaginatedResponse<{ 
    /**
     * The list of currencies
     */
    currencies: AdminCurrency[]
  }> {}
