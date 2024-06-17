import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const FULFILLMENT_PROVIDERS_QUERY_KEY = "f_providers" as const
export const fulfillmentProvidersQueryKeys = queryKeysFactory(
  FULFILLMENT_PROVIDERS_QUERY_KEY
)

export const useFulfillmentProviders = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<any, Error, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.fulfillmentProviders.list(query),
    queryKey: fulfillmentProvidersQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
