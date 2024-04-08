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
  CreateStockLocationReq,
  UpdateStockLocationReq,
} from "../../types/api-payloads"
import {
  StockLocationDeleteRes,
  StockLocationListRes,
  StockLocationRes,
} from "../../types/api-responses"

const STOCK_LOCATIONS_QUERY_KEY = "stock_locations" as const
const stockLocationsQueryKeys = queryKeysFactory(STOCK_LOCATIONS_QUERY_KEY)

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
    queryKey: stockLocationsQueryKeys.detail(id),
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
        queryKey: stockLocationsQueryKeys.detail(id),
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
