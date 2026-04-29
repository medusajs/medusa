import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

import { sdk } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const LOCALES_QUERY_KEY = "locales" as const
const localesQueryKeys = queryKeysFactory(LOCALES_QUERY_KEY)

export const useLocales = (
  query?: HttpTypes.AdminLocaleListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminLocaleListResponse,
      FetchError,
      HttpTypes.AdminLocaleListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.locale.list(query),
    queryKey: localesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useLocale = (
  id: string,
  query?: HttpTypes.AdminLocaleParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminLocaleResponse,
      FetchError,
      HttpTypes.AdminLocaleResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: localesQueryKeys.detail(id),
    queryFn: async () => sdk.admin.locale.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}
