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
import { stockLocationsQueryKeys } from "./stock-locations"

const SHIPPING_OPTIONS_QUERY_KEY = "shipping_options" as const
export const shippingOptionsQueryKeys = queryKeysFactory(
  SHIPPING_OPTIONS_QUERY_KEY
)

// TODO: Endpoint is not implemented yet
// export const useShippingOption = (
//   id: string,
//   options?: UseQueryOptions<
//     HttpTypes.AdminShippingOptionResponse,
//     Error,
//     HttpTypes.AdminShippingOptionResponse,
//     QueryKey
//   >
// ) => {
//   const { data, ...rest } = useQuery({
//     queryFn: () => sdk.admin.shippingOption.retrieve(id),
//     queryKey: shippingOptionsQueryKeys.retrieve(id),
//     ...options,
//   })

//   return { ...data, ...rest }
// }

export const useShippingOptions = (
  query?: HttpTypes.AdminShippingOptionListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminShippingOptionListResponse,
      Error,
      HttpTypes.AdminShippingOptionListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.shippingOption.list(query),
    queryKey: shippingOptionsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateShippingOptions = (
  options?: UseMutationOptions<
    HttpTypes.AdminShippingOptionResponse,
    FetchError,
    HttpTypes.AdminCreateShippingOption
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.shippingOption.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: shippingOptionsQueryKeys.all,
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateShippingOptions = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminShippingOptionResponse,
    FetchError,
    HttpTypes.AdminUpdateShippingOption
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.shippingOption.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: shippingOptionsQueryKeys.all,
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteShippingOption = (
  optionId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminShippingOptionDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.shippingOption.delete(optionId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: shippingOptionsQueryKeys.all,
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
