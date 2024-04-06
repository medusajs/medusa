import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { CategoriesListRes, CategoryRes } from "../../types/api-responses"

const CATEGORIES_QUERY_KEY = "categories" as const
export const categoriesQueryKeys = queryKeysFactory(CATEGORIES_QUERY_KEY)

export const useCategory = (
  id: string,
  options?: Omit<
    UseQueryOptions<CategoryRes, Error, CategoryRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: categoriesQueryKeys.detail(id),
    queryFn: async () => client.categories.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCategories = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<CategoriesListRes, Error, CategoriesListRes, QueryKey>,
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
