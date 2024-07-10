import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const TAGS_QUERY_KEY = "tags" as const
export const tagsQueryKeys = queryKeysFactory(TAGS_QUERY_KEY)

export const useTag = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminProductTagResponse,
      FetchError,
      HttpTypes.AdminProductTagResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: tagsQueryKeys.detail(id),
    queryFn: async () => sdk.admin.productTag.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useTags = (
  query?: HttpTypes.AdminProductTagListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminProductTagListResponse,
      FetchError,
      HttpTypes.AdminProductTagListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: tagsQueryKeys.list(query),
    queryFn: async () => sdk.admin.productTag.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
