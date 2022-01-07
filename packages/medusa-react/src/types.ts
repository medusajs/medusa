import {
  Region,
  ProductVariant as ProductVariantEntity,
  StoreCartsRes,
} from "@medusajs/medusa"
import {
  QueryClient,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from "react-query"

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
export type ProductVariant = ConvertDateToString<
  Omit<ProductVariantEntity, "beforeInsert">
>
export type ProductVariantInfo = Pick<ProductVariant, "prices">

type ConvertDateToString<T extends {}> = {
  [P in keyof T]: T[P] extends Date ? Date | string : T[P]
}

export type Cart = StoreCartsRes["cart"]

export type QueryKeys<
  TInvalidationKey extends QueryKey,
  TUpdateKey extends QueryKey
> = {
  invalidationQueryKey: TInvalidationKey
  updateQueryKey: TUpdateKey
}

export type UseOptionsFactory = <
  TData,
  TError,
  TVariables,
  TContext,
  TUpdateKey extends QueryKey,
  TInvalidationKey extends QueryKey
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  {
    updateQueryKey,
    invalidationQueryKey,
  }: QueryKeys<TInvalidationKey, TUpdateKey>,
  config?: any
) => UseMutationOptions<TData, TError, TVariables, TContext>

export type OptionsBuilder = <
  TData,
  TError,
  TVariables,
  TContext,
  TKey extends QueryKey
>(
  queryClient: QueryClient,
  queryKey: TKey,
  options: UseMutationOptions<TData, TError, TVariables, TContext>
) => UseMutationOptions<TData, TError, TVariables, TContext>

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
