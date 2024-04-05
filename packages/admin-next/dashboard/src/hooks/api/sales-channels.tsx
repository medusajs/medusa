import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"

import { client } from "../../lib/client"
import { queryClient } from "../../lib/medusa"
import { queryKeysFactory } from "../../lib/query-key-factory"
import {
  CreateSalesChannelReq,
  UpdateSalesChannelReq,
} from "../../types/api-payloads"
import { SalesChannelListRes, SalesChannelRes } from "../../types/api-responses"

const SALES_CHANNELS_QUERY_KEY = "sales-channels" as const
const salesChannelsQueryKeys = queryKeysFactory(SALES_CHANNELS_QUERY_KEY)

export const useSalesChannel = (
  id: string,
  options?: Omit<
    UseQueryOptions<SalesChannelRes, Error, SalesChannelRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: salesChannelsQueryKeys.detail(id),
    queryFn: async () => client.salesChannels.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useSalesChannels = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<SalesChannelListRes, Error, SalesChannelListRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.salesChannels.list(query),
    queryKey: salesChannelsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateSalesChannel = (
  options?: UseMutationOptions<SalesChannelRes, Error, CreateSalesChannelReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.salesChannels.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateSalesChannel = (
  id: string,
  options?: UseMutationOptions<SalesChannelRes, Error, UpdateSalesChannelReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.salesChannels.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
