import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import { CreateShippingProfileReq } from "../../types/api-payloads"
import {
  ShippingProfileDeleteRes,
  ShippingProfileListRes,
  ShippingProfileRes,
} from "../../types/api-responses"

import { client } from "../../lib/client"
import { queryClient } from "../../lib/medusa"
import { queryKeysFactory } from "../../lib/query-key-factory"

const SHIPPING_PROFILE_QUERY_KEY = "shipping_profile" as const
export const shippingProfileQueryKeys = queryKeysFactory(
  SHIPPING_PROFILE_QUERY_KEY
)

export const useCreateShippingProfile = (
  options?: UseMutationOptions<
    ShippingProfileRes,
    Error,
    CreateShippingProfileReq
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.shippingProfiles.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: shippingProfileQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useShippingProfiles = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      ShippingProfileListRes,
      Error,
      ShippingProfileListRes,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.shippingProfiles.list(query),
    queryKey: shippingProfileQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useDeleteShippingProfile = (
  profileId: string,
  options?: UseMutationOptions<ShippingProfileDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.shippingProfiles.delete(profileId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: shippingProfileQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
