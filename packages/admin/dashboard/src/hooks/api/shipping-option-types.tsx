import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const SHIPPING_OPTION_TYPES_QUERY_KEY = "shipping_option_types" as const
export const shippingOptionTypesQueryKeys = queryKeysFactory(
  SHIPPING_OPTION_TYPES_QUERY_KEY
)

export const useShippingOptionType = (
  id: string,
  query?: HttpTypes.SelectParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminShippingOptionTypeResponse,
      FetchError,
      HttpTypes.AdminShippingOptionTypeResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.shippingOptionType.retrieve(id, query),
    queryKey: shippingOptionTypesQueryKeys.detail(id),
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
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.shippingOptionType.list(query),
    queryKey: shippingOptionTypesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateShippingOptionType = (
  options?: UseMutationOptions<
    HttpTypes.AdminShippingOptionTypeResponse,
    FetchError,
    HttpTypes.AdminCreateShippingOptionType
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.shippingOptionType.create(payload),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: shippingOptionTypesQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    ...options,
  })
}

export const useUpdateShippingOptionType = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminShippingOptionTypeResponse,
    FetchError,
    HttpTypes.AdminUpdateShippingOptionType
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.shippingOptionType.update(id, payload),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: shippingOptionTypesQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: shippingOptionTypesQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    ...options,
  })
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
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: shippingOptionTypesQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: shippingOptionTypesQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    ...options,
  })
}
