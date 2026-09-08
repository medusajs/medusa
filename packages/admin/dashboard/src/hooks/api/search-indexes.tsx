import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const SEARCH_INDEXES_QUERY_KEY = "search_indexes" as const
export const searchIndexesQueryKeys = queryKeysFactory(SEARCH_INDEXES_QUERY_KEY)

export const useSearchIndexes = (
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminSearchIndexListResponse,
      FetchError,
      HttpTypes.AdminSearchIndexListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.search.listIndexes(),
    queryKey: searchIndexesQueryKeys.list(),
    ...options,
  })

  return { ...data, ...rest }
}

export const useReindexSearchIndex = (
  options?: UseMutationOptions<
    HttpTypes.AdminSearchIndexReindexResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (id: string) => sdk.admin.search.reindex(id),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: searchIndexesQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
  })
}
