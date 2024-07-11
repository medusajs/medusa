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
import { shippingOptionsQueryKeys } from "./shipping-options"
import { stockLocationsQueryKeys } from "./stock-locations"

const FULFILLMENT_SETS_QUERY_KEY = "fulfillment_sets" as const
export const fulfillmentSetsQueryKeys = queryKeysFactory(
  FULFILLMENT_SETS_QUERY_KEY
)

export const useDeleteFulfillmentSet = (
  id: string,
  options?: Omit<
    UseMutationOptions<
      HttpTypes.AdminFulfillmentSetDeleteResponse,
      FetchError,
      void
    >,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.fulfillmentSet.delete(id),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: fulfillmentSetsQueryKeys.detail(id),
      })
      await queryClient.invalidateQueries({
        queryKey: fulfillmentSetsQueryKeys.lists(),
      })

      // We need to invalidate all related entities. We invalidate using `all` keys to ensure that all relevant entities are invalidated.
      await queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.all,
        refetchType: "all",
      })
      await queryClient.invalidateQueries({
        queryKey: shippingOptionsQueryKeys.all,
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
      HttpTypes.AdminFulfillmentSetResponse,
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
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: fulfillmentSetsQueryKeys.lists(),
      })
      await queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.all,
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateFulfillmentSetServiceZone = (
  fulfillmentSetId: string,
  serviceZoneId: string,
  options?: Omit<
    UseMutationOptions<
      HttpTypes.AdminFulfillmentSetResponse,
      FetchError,
      HttpTypes.AdminUpdateFulfillmentSetServiceZone,
      QueryKey
    >,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.fulfillmentSet.updateServiceZone(
        fulfillmentSetId,
        serviceZoneId,
        payload
      ),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: fulfillmentSetsQueryKeys.lists(),
      })
      await queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.all,
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
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: fulfillmentSetsQueryKeys.lists(),
      })
      await queryClient.invalidateQueries({
        queryKey: shippingOptionsQueryKeys.lists(),
      })
      await queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.all,
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
