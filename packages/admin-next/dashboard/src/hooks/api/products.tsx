import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { ProductListRes, ProductRes } from "../../types/api-responses"

const PRODUCTS_QUERY_KEY = "products" as const
export const productsQueryKeys = queryKeysFactory(PRODUCTS_QUERY_KEY)

export const useProduct = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<ProductRes, Error, ProductRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.products.retrieve(id, query),
    queryKey: productsQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useProducts = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<ProductListRes, Error, ProductListRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.products.list(query),
    queryKey: productsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
