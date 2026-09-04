import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  keepPreviousData,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const SEARCH_QUERY_KEY = "search" as const
export const searchQueryKeys = queryKeysFactory(SEARCH_QUERY_KEY)

export const useAdminSearch = (
  query?: HttpTypes.AdminSearchParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminSearchResponse,
      FetchError,
      HttpTypes.AdminSearchResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.search.list(query),
    queryKey: searchQueryKeys.list(query),
    placeholderData: keepPreviousData,
    ...options,
  })

  return { ...data, ...rest }
}
