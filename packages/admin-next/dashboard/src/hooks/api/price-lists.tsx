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
  AddPriceListPricesReq,
  CreatePriceListReq,
  DeletePriceListPricesReq,
  UpdatePriceListReq,
} from "../../types/api-payloads"
import {
  PriceListDeleteRes,
  PriceListListRes,
  PriceListRes,
} from "../../types/api-responses"

const PRICE_LISTS_QUERY_KEY = "price-lists" as const
export const priceListsQueryKeys = queryKeysFactory(PRICE_LISTS_QUERY_KEY)

export const usePriceList = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<PriceListRes, Error, PriceListRes, QueryKey>,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.priceLists.retrieve(id, query),
    queryKey: priceListsQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const usePriceLists = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<PriceListListRes, Error, PriceListListRes, QueryKey>,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.priceLists.list(query),
    queryKey: priceListsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreatePriceList = (
  options?: UseMutationOptions<PriceListRes, Error, CreatePriceListReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.priceLists.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: priceListsQueryKeys.list() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdatePriceList = (
  id: string,
  options?: UseMutationOptions<PriceListRes, Error, UpdatePriceListReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.priceLists.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: priceListsQueryKeys.list() })
      queryClient.invalidateQueries({
        queryKey: priceListsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeletePriceList = (
  id: string,
  options?: UseMutationOptions<PriceListDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.priceLists.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: priceListsQueryKeys.list() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const usePriceListAddPrices = (
  id: string,
  options?: UseMutationOptions<PriceListRes, Error, AddPriceListPricesReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.priceLists.addPrices(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: priceListsQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({ queryKey: priceListsQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const usePriceListRemovePrices = (
  id: string,
  options?: UseMutationOptions<PriceListRes, Error, DeletePriceListPricesReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.priceLists.removePrices(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: priceListsQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({ queryKey: priceListsQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
