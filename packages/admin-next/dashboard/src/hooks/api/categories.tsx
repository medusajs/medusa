import {
  AdminProductCategoryListResponse,
  AdminProductCategoryResponse,
} from "@medusajs/types"
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const CATEGORIES_QUERY_KEY = "categories" as const
export const categoriesQueryKeys = queryKeysFactory(CATEGORIES_QUERY_KEY)

export const useCategory = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      AdminProductCategoryResponse,
      Error,
      AdminProductCategoryResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: categoriesQueryKeys.detail(id, query),
    queryFn: async () => client.categories.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCategories = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      AdminProductCategoryListResponse,
      Error,
      AdminProductCategoryListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: categoriesQueryKeys.list(query),
    queryFn: async () => client.categories.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
