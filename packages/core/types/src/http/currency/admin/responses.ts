import { PaginatedResponse } from "../../common"
import { AdminCurrency } from "./entities"

export interface AdminCurrencyResponse {
  currency: AdminCurrency
}

export interface AdminCurrencyListResponse
  extends PaginatedResponse<{ currencies: AdminCurrency[] }> {}
