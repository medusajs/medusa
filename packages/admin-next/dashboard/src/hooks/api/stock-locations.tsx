import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"

import { client } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import {
  CreateFulfillmentSetReq,
  CreateServiceZoneReq,
  CreateStockLocationReq,
  UpdateServiceZoneReq,
  UpdateStockLocationReq,
  UpdateStockLocationSalesChannelsReq,
} from "../../types/api-payloads"
import {
  FulfillmentSetDeleteRes,
  ServiceZoneDeleteRes,
  StockLocationDeleteRes,
  StockLocationListRes,
  StockLocationRes,
} from "../../types/api-responses"

const STOCK_LOCATIONS_QUERY_KEY = "stock_locations" as const
export const stockLocationsQueryKeys = queryKeysFactory(
  STOCK_LOCATIONS_QUERY_KEY
)

export const useStockLocation = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<StockLocationRes, Error, StockLocationRes, QueryKey>,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.stockLocations.retrieve(id, query),
    queryKey: stockLocationsQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useStockLocations = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      StockLocationListRes,
      Error,
      StockLocationListRes,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.stockLocations.list(query),
    queryKey: stockLocationsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateStockLocation = (
  options?: UseMutationOptions<StockLocationRes, Error, CreateStockLocationReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.stockLocations.create(payload),
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
  options?: UseMutationOptions<StockLocationRes, Error, UpdateStockLocationReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.stockLocations.update(id, payload),
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
    StockLocationRes,
    Error,
    UpdateStockLocationSalesChannelsReq
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      client.stockLocations.updateSalesChannels(id, payload),
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
  options?: UseMutationOptions<StockLocationDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.stockLocations.delete(id),
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

export const useCreateFulfillmentSet = (
  locationId: string,
  options?: UseMutationOptions<StockLocationRes, Error, CreateFulfillmentSetReq>
) => {
  return useMutation({
    mutationFn: (payload) =>
      client.stockLocations.createFulfillmentSet(locationId, payload),
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
  locationId: string,
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
