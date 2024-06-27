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
import { customerGroupsQueryKeys } from "./customer-groups"
import { productsQueryKeys } from "./products"

const PRICE_LISTS_QUERY_KEY = "price-lists" as const
export const priceListsQueryKeys = queryKeysFactory(PRICE_LISTS_QUERY_KEY)

export const usePriceList = (
  id: string,
  query?: HttpTypes.AdminPriceListListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminPriceListResponse,
      FetchError,
      HttpTypes.AdminPriceListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.priceList.retrieve(id, query),
    queryKey: priceListsQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const usePriceLists = (
  query?: HttpTypes.AdminPriceListListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminPriceListListResponse,
      FetchError,
      HttpTypes.AdminPriceListListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.priceList.list(query),
    queryKey: priceListsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreatePriceList = (
  query?: HttpTypes.AdminPriceListParams,
  options?: UseMutationOptions<
    HttpTypes.AdminPriceListResponse,
    FetchError,
    HttpTypes.AdminCreatePriceList
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.priceList.create(payload, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: priceListsQueryKeys.list() })

      queryClient.invalidateQueries({ queryKey: customerGroupsQueryKeys.all })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdatePriceList = (
  id: string,
  query?: HttpTypes.AdminPriceListParams,
  options?: UseMutationOptions<
    HttpTypes.AdminPriceListResponse,
    FetchError,
    HttpTypes.AdminUpdatePriceList
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.priceList.update(id, payload, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: priceListsQueryKeys.list() })
      queryClient.invalidateQueries({
        queryKey: priceListsQueryKeys.detail(id),
      })

      queryClient.invalidateQueries({ queryKey: customerGroupsQueryKeys.all })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeletePriceList = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminPriceListDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.priceList.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: priceListsQueryKeys.list() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useBatchPriceListPrices = (
  id: string,
  query?: HttpTypes.AdminPriceListParams,
  options?: UseMutationOptions<
    HttpTypes.AdminPriceListResponse,
    FetchError,
    HttpTypes.AdminBatchPriceListPrice
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.priceList.batchPrices(id, payload, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: priceListsQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const usePriceListLinkProducts = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminPriceListResponse,
    FetchError,
    HttpTypes.AdminLinkPriceListProducts
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.priceList.linkProducts(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: priceListsQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({ queryKey: priceListsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
