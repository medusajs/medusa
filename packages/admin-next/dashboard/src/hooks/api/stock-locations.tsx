import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"

import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const STOCK_LOCATIONS_QUERY_KEY = "stock_locations" as const
export const stockLocationsQueryKeys = queryKeysFactory(
  STOCK_LOCATIONS_QUERY_KEY
)

export const useStockLocation = (
  id: string,
  query?: HttpTypes.SelectParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminStockLocationResponse,
      FetchError,
      HttpTypes.AdminStockLocationResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.stockLocation.retrieve(id, query),
    queryKey: stockLocationsQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useStockLocations = (
  query?: HttpTypes.FindParams & HttpTypes.AdminStockLocationFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminStockLocationListResponse,
      FetchError,
      HttpTypes.AdminStockLocationListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.stockLocation.list(query),
    queryKey: stockLocationsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateStockLocation = (
  options?: UseMutationOptions<
    HttpTypes.AdminStockLocationResponse,
    Error,
    HttpTypes.AdminCreateStockLocation
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.stockLocation.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateStockLocation = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminStockLocationResponse,
    Error,
    HttpTypes.AdminUpdateStockLocation
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.stockLocation.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateStockLocationSalesChannels = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminStockLocationResponse,
    Error,
    HttpTypes.AdminUpdateStockLocationSalesChannels
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.stockLocation.updateSalesChannels(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteStockLocation = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminStockLocationDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.stockLocation.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCreateStockLocationFulfillmentSet = (
  locationId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminStockLocationResponse,
    Error,
    HttpTypes.AdminCreateStockLocationFulfillmentSet
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.stockLocation.createFulfillmentSet(locationId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
