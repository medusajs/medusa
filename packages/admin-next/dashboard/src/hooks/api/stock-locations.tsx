import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"

import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { client, sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import {
  CreateServiceZoneReq,
  UpdateServiceZoneReq,
} from "../../types/api-payloads"
import {
  FulfillmentSetDeleteRes,
  ServiceZoneDeleteRes,
  StockLocationRes,
} from "../../types/api-responses"

const STOCK_LOCATIONS_QUERY_KEY = "stock_locations" as const
export const stockLocationsQueryKeys = queryKeysFactory(
  STOCK_LOCATIONS_QUERY_KEY
)

export const useStockLocation = (
  id: string,
  query?: HttpTypes.SelectParams,
  options?: Omit<
    UseQueryOptions<
      { stock_location: HttpTypes.AdminStockLocation },
      FetchError,
      { stock_location: HttpTypes.AdminStockLocation },
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
      HttpTypes.PaginatedResponse<{
        stock_locations: HttpTypes.AdminStockLocation[]
      }>,
      FetchError,
      HttpTypes.PaginatedResponse<{
        stock_locations: HttpTypes.AdminStockLocation[]
      }>,
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
    { stock_location: HttpTypes.AdminStockLocation },
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
    { stock_location: HttpTypes.AdminStockLocation },
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
    { stock_location: HttpTypes.AdminStockLocation },
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
    HttpTypes.DeleteResponse<"stock_location">,
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
    { stock_location: HttpTypes.AdminStockLocation },
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

export const useCreateServiceZone = (
  locationId: string,
  fulfillmentSetId: string,
  options?: UseMutationOptions<StockLocationRes, Error, CreateServiceZoneReq>
) => {
  return useMutation({
    mutationFn: (payload) =>
      client.stockLocations.createServiceZone(fulfillmentSetId, payload),
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

export const useUpdateServiceZone = (
  fulfillmentSetId: string,
  serviceZoneId: string,
  options?: UseMutationOptions<StockLocationRes, Error, UpdateServiceZoneReq>
) => {
  return useMutation({
    mutationFn: (payload) =>
      client.stockLocations.updateServiceZone(
        fulfillmentSetId,
        serviceZoneId,
        payload
      ),
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

export const useDeleteFulfillmentSet = (
  setId: string,
  options?: UseMutationOptions<FulfillmentSetDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.stockLocations.deleteFulfillmentSet(setId),
    onSuccess: (data: any, variables: any, context: any) => {
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

export const useDeleteServiceZone = (
  setId: string,
  zoneId: string,
  options?: UseMutationOptions<ServiceZoneDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.stockLocations.deleteServiceZone(setId, zoneId),
    onSuccess: (data: any, variables: any, context: any) => {
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
