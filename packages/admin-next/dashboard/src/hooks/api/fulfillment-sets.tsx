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

export const useDeleteFulfillmentSet = (
  id: string,
  options?: Omit<
    UseMutationOptions<
      HttpTypes.AdminFulfillmentSetsDeleteResponse,
      FetchError,
      void
    >,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.fulfillmentSet.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: fulfillmentSetsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useFulfillmentSetServiceZone = (
  fulfillmentSetId: string,
  serviceZoneId: string,
  query?: HttpTypes.SelectParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminServiceZoneResponse,
      FetchError,
      HttpTypes.AdminServiceZoneResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () =>
      sdk.admin.fulfillmentSet.retrieveServiceZone(
        fulfillmentSetId,
        serviceZoneId,
        query
      ),
    queryKey: fulfillmentSetsQueryKeys.detail(fulfillmentSetId, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateFulfillmentSetServiceZone = (
  fulfillmentSetId: string,
  options?: Omit<
    UseMutationOptions<
      HttpTypes.AdminServiceZoneResponse,
      FetchError,
      HttpTypes.AdminCreateFulfillmentSetServiceZone,
      QueryKey
    >,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.fulfillmentSet.createServiceZone(fulfillmentSetId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: fulfillmentSetsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteFulfillmentServiceZone = (
  fulfillmentSetId: string,
  serviceZoneId: string,
  options?: Omit<
    UseMutationOptions<
      HttpTypes.AdminServiceZoneDeleteResponse,
      FetchError,
      void
    >,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: () =>
      sdk.admin.fulfillmentSet.deleteServiceZone(
        fulfillmentSetId,
        serviceZoneId
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: fulfillmentSetsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
