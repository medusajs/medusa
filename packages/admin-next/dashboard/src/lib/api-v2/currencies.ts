import { CurrencyDTO } from "@medusajs/types"
import { adminCurrenciesKeys, useAdminCustomQuery } from "medusa-react"
import { V2ListRes } from "./types/common"

// TODO: Add types once we export V2 API types
export const useV2Currencies = (query?: any, options?: any) => {
  const { data, ...rest } = useAdminCustomQuery(
    `/admin/currencies`,
    adminCurrenciesKeys.list(query),
    query,
    options
  )

  const typedData: {
    currencies: CurrencyDTO[] | undefined
  } & V2ListRes = {
    currencies: data?.currencies,
    count: data?.count,
    offset: data?.offset,
    limit: data?.limit,
  }

  return { ...typedData, ...rest }
}

export const useV2Currency = (id: string, options?: any) => {
  const { data, ...rest } = useAdminCustomQuery(
    `/admin/currencies/${id}`,
    adminCurrenciesKeys.detail(id),
    undefined,
    options
  )

  const currency: CurrencyDTO | undefined = data?.currency

  return { currency, ...rest }
}
