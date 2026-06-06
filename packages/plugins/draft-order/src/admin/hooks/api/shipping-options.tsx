import { FetchError } from "@zjedene-medusa/js-sdk"
import { HttpTypes } from "@zjedene-medusa/types"
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/queries/sdk"

const SHIPPING_OPTION_QUERY_KEY = "shipping-options"

export const shippingOptionsQueryKeys = {
  list: (query?: Record<string, any>) => [
    SHIPPING_OPTION_QUERY_KEY,
    query ? query : undefined,
  ],
  detail: (id: string, query?: Record<string, any>) => [
    SHIPPING_OPTION_QUERY_KEY,
    id,
    query ? query : undefined,
  ],
}

export const useShippingOption = (
  id: string,
  query?: HttpTypes.SelectParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminShippingOptionResponse,
      FetchError,
      HttpTypes.AdminShippingOptionResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: shippingOptionsQueryKeys.detail(id, query),
    queryFn: async () => sdk.admin.shippingOption.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useShippingOptions = (
  query?: HttpTypes.AdminShippingOptionListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminShippingOptionListResponse,
      FetchError,
      HttpTypes.AdminShippingOptionListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: shippingOptionsQueryKeys.list(query),
    queryFn: async () => sdk.admin.shippingOption.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
