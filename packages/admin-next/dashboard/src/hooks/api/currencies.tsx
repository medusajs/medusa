import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { CurrencyListRes, CurrencyRes } from "../../types/api-responses"

const CURRENCIES_QUERY_KEY = "currencies" as const
const currenciesQueryKeys = queryKeysFactory(CURRENCIES_QUERY_KEY)

export const useCurrencies = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<CurrencyListRes, Error, CurrencyListRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.currencies.list(query),
    queryKey: currenciesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCurrency = (
  id: string,
  options?: Omit<
    UseQueryOptions<CurrencyRes, Error, CurrencyRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: currenciesQueryKeys.detail(id),
    queryFn: async () => client.currencies.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}
