import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

import { sdk } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const CURRENCIES_QUERY_KEY = "currencies" as const
const currenciesQueryKeys = queryKeysFactory(CURRENCIES_QUERY_KEY)

export const useCurrencies = (
  query?: HttpTypes.AdminCurrencyListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminCurrencyListResponse,
      FetchError,
      HttpTypes.AdminCurrencyListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.currency.list(query),
    queryKey: currenciesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCurrency = (
  id: string,
  query?: HttpTypes.AdminCurrencyParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminCurrencyResponse,
      FetchError,
      HttpTypes.AdminCurrencyResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: currenciesQueryKeys.detail(id),
    queryFn: async () => sdk.admin.currency.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}
