import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const FULFILLMENT_SETS_QUERY_KEY = "fulfillment_sets" as const
export const fulfillmentSetsQueryKeys = queryKeysFactory(
  FULFILLMENT_SETS_QUERY_KEY
)

export const useServiceZone = (
  id: string,
  query?: HttpTypes.SelectParams,
  options?: Omit<
    UseQueryOptions<
      { service_zone: HttpTypes.AdminServiceZone },
      FetchError,
      { service_zone: HttpTypes.AdminServiceZone },
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.fulfillmentSet.retrieve(id, query),
    queryKey: fulfillmentSetsQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateServiceZone = (
  options?: Omit<
    UseMutationOptions<
      { service_zone: HttpTypes.AdminServiceZone },
      FetchError,
      HttpTypes.AdminCreateServiceZone,
      QueryKey
    >,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.serviceZone.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: fulfillmentSetsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
