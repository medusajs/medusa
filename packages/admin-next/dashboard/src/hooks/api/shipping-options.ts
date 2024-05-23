import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"

import { client } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import {
  CreateShippingOptionReq,
  UpdateShippingOptionReq,
} from "../../types/api-payloads"
import {
  ShippingOptionDeleteRes,
  ShippingOptionRes,
} from "../../types/api-responses"
import { stockLocationsQueryKeys } from "./stock-locations"

export const useShippingOptions = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<any, Error, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.shippingOptions.list(query),
    queryKey: stockLocationsQueryKeys.all,
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateShippingOptions = (
  options?: UseMutationOptions<
    ShippingOptionRes,
    Error,
    CreateShippingOptionReq
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.shippingOptions.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.all,
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateShippingOptions = (
  id: string,
  options?: UseMutationOptions<
    ShippingOptionRes,
    Error,
    UpdateShippingOptionReq
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.shippingOptions.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.all,
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteShippingOption = (
  optionId: string,
  options?: UseMutationOptions<ShippingOptionDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.shippingOptions.delete(optionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.all,
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
