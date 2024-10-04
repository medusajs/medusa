import { PaginatedResponse } from "../../common"
import { StoreCurrency } from "./entities"

export interface StoreCurrencyResponse {
  currency: StoreCurrency
}

export interface StoreCurrencyListResponse
  extends PaginatedResponse<{ currencies: StoreCurrency[] }> {}
