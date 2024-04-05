import { CurrencyListRes, CurrencyRes } from "../../types/api-responses"
import { getRequest } from "./common"

async function retrieveCurrency(id: string, query?: Record<string, any>) {
  return getRequest<CurrencyRes>(`/admin/currencies/${id}`, query)
}

async function listCurrencies(query?: Record<string, any>) {
  return getRequest<CurrencyListRes>("/admin/currencies", query)
}

export const currencies = {
  retrieve: retrieveCurrency,
  list: listCurrencies,
}
