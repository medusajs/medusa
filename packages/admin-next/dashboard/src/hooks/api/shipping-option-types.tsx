import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"

import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"

import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const SHIPPING_OPTION_TYPE_QUERY_KEY = "shipping_option_type" as const
export const shippingOptionTypeQueryKeys = queryKeysFactory(
  SHIPPING_OPTION_TYPE_QUERY_KEY
)

export const useCreateShippingOptionType = (
  options?: UseMutationOptions<
    HttpTypes.AdminShippingOptionTypeResponse,
    FetchError,
    HttpTypes.AdminCreateShippingOptionType
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.shippingOptionType.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: shippingOptionTypeQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useShippingOptionType = (
  id: string,
  query?: Record<string, any>,
  options?: UseQueryOptions<
    HttpTypes.AdminShippingOptionTypeResponse,
    FetchError,
    HttpTypes.AdminShippingOptionTypeResponse,
    QueryKey
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.shippingOptionType.retrieve(id, query),
    queryKey: shippingOptionTypeQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useShippingOptionTypes = (
  query?: HttpTypes.AdminShippingOptionTypeListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminShippingOptionTypeListResponse,
      FetchError,
      HttpTypes.AdminShippingOptionTypeListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.shippingOptionType.list(query),
    queryKey: shippingOptionTypeQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useDeleteShippingOptionType = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminShippingOptionTypeDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.shippingOptionType.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: shippingOptionTypeQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: shippingOptionTypeQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
