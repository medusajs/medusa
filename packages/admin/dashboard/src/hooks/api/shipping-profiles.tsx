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

const SHIPPING_PROFILE_QUERY_KEY = "shipping_profile" as const
export const shippingProfileQueryKeys = queryKeysFactory(
  SHIPPING_PROFILE_QUERY_KEY
)

export const useCreateShippingProfile = (
  options?: UseMutationOptions<
    HttpTypes.AdminShippingProfileResponse,
    FetchError,
    HttpTypes.AdminCreateShippingProfile
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.shippingProfile.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: shippingProfileQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useShippingProfile = (
  id: string,
  query?: Record<string, any>,
  options?: UseQueryOptions<
    HttpTypes.AdminShippingProfileResponse,
    FetchError,
    HttpTypes.AdminShippingProfileResponse,
    QueryKey
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.shippingProfile.retrieve(id, query),
    queryKey: shippingProfileQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useShippingProfiles = (
  query?: HttpTypes.AdminShippingProfileListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminShippingProfileListResponse,
      FetchError,
      HttpTypes.AdminShippingProfileListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.shippingProfile.list(query),
    queryKey: shippingProfileQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useDeleteShippingProfile = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminShippingProfileDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.shippingProfile.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: shippingProfileQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: shippingProfileQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
