import {
  Region,
  ProductVariant as ProductVariantEntity,
  StoreCartsRes,
} from "@medusajs/medusa"
import { QueryKey, UseQueryOptions } from "react-query"

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
