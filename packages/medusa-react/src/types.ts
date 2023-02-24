import {
  ProductVariant,
  Region,
  SetRequired,
  StoreCartsRes,
} from "@medusajs/client-types"
import { QueryKey, UseQueryOptions } from "@tanstack/react-query"

export type UseQueryOptionsWrapper<
  // Return type of queryFn
  TQueryFn = unknown,
  // Type thrown in case the queryFn rejects
  E = Error,
  // Query key type
  TQueryKey extends QueryKey = QueryKey
> = Omit<
  UseQueryOptions<TQueryFn, E, TQueryFn, TQueryKey>,
  "queryKey" | "queryFn" | "select" | "refetchInterval"
>

// Choose only a subset of the type Region to allow for some flexibility
export type RegionInfo = Pick<Region, "currency_code" | "tax_code" | "tax_rate">

export type ProductVariantWithPrices = SetRequired<ProductVariant, "prices">

export type ProductVariantInfo = Pick<ProductVariantWithPrices, "prices">

export type Cart = StoreCartsRes["cart"]

export type TQueryKey<TKey, TListQuery = any, TDetailQuery = string> = {
  all: [TKey]
  lists: () => [...TQueryKey<TKey>["all"], "list"]
  list: (
    query?: TListQuery
  ) => [
    ...ReturnType<TQueryKey<TKey>["lists"]>,
    { query: TListQuery | undefined }
  ]
  details: () => [...TQueryKey<TKey>["all"], "detail"]
  detail: (
    id: TDetailQuery
  ) => [...ReturnType<TQueryKey<TKey>["details"]>, TDetailQuery]
}
