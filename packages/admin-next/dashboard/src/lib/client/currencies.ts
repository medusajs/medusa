import { CurrencyListRes, CurrencyRes } from "../../types/api-responses"
import { makeRequest } from "./common"

async function retrieveCurrency(id: string) {
  return makeRequest<CurrencyRes>(`/admin/currencies/${id}`)
}

async function listCurrencies(query?: Record<string, any>) {
  return makeRequest<CurrencyListRes, Record<string, any>>(
    "/admin/currencies",
    query
  )
}

export const currencies = {
  retrieve: retrieveCurrency,
  list: listCurrencies,
}
