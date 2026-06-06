import { FetchError } from "@zjedene-medusa/js-sdk"
import { HttpTypes } from "@zjedene-medusa/types"
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../lib/queries/sdk"

const SALES_CHANNEL_QUERY_KEY = "sales-channels"

export const salesChannelsQueryKeys = {
  list: (query?: Record<string, any>) => [
    SALES_CHANNEL_QUERY_KEY,
    query ? query : undefined,
  ],
  detail: (id: string, query?: Record<string, any>) => [
    SALES_CHANNEL_QUERY_KEY,
    id,
    query ? query : undefined,
  ],
}

export const useSalesChannel = (
  id: string,
  query?: HttpTypes.SelectParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminSalesChannelResponse,
      FetchError,
      HttpTypes.AdminSalesChannelResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: salesChannelsQueryKeys.detail(id, query),
    queryFn: async () => sdk.admin.salesChannel.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useSalesChannels = (
  query?: HttpTypes.AdminSalesChannelListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminSalesChannelListResponse,
      FetchError,
      HttpTypes.AdminSalesChannelListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: salesChannelsQueryKeys.list(query),
    queryFn: async () => sdk.admin.salesChannel.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
