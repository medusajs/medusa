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

const TAGS_QUERY_KEY = "tags" as const
export const productTagsQueryKeys = queryKeysFactory(TAGS_QUERY_KEY)

export const useProductTag = (
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
    queryKey: productTagsQueryKeys.detail(id),
    queryFn: async () => sdk.admin.productTag.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useProductTags = (
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
    queryKey: productTagsQueryKeys.list(query),
    queryFn: async () => sdk.admin.productTag.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateProductTag = (
  query?: HttpTypes.AdminProductTagParams,
  options?: UseMutationOptions<
    HttpTypes.AdminProductTagResponse,
    FetchError,
    HttpTypes.AdminCreateProductTag
  >
) => {
  return useMutation({
    mutationFn: async (data) => sdk.admin.productTag.create(data, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: productTagsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
