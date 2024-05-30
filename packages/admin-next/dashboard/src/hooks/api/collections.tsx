import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes, PaginatedResponse } from "@medusajs/types"
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
import { productsQueryKeys } from "./products"

const COLLECTION_QUERY_KEY = "collections" as const
export const collectionsQueryKeys = queryKeysFactory(COLLECTION_QUERY_KEY)

export const useCollection = (
  id: string,
  query?: HttpTypes.SelectParams,
  options?: Omit<
    UseQueryOptions<
      { collection: HttpTypes.AdminCollection },
      FetchError,
      { collection: HttpTypes.AdminCollection },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: collectionsQueryKeys.detail(id),
    queryFn: async () => sdk.admin.collection.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCollections = (
  query?: HttpTypes.FindParams & HttpTypes.AdminCollectionFilters,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<{ collections: HttpTypes.AdminCollection[] }>,
      FetchError,
      PaginatedResponse<{ collections: HttpTypes.AdminCollection[] }>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: collectionsQueryKeys.list(query),
    queryFn: async () => sdk.admin.collection.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateCollection = (
  id: string,
  options?: UseMutationOptions<
    { collection: HttpTypes.AdminCollection },
    FetchError,
    HttpTypes.AdminUpdateCollection
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.collection.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: collectionsQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: collectionsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateCollectionProducts = (
  id: string,
  options?: UseMutationOptions<
    { collection: HttpTypes.AdminCollection },
    FetchError,
    HttpTypes.AdminUpdateCollectionProducts
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.collection.updateProducts(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: collectionsQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: collectionsQueryKeys.detail(id),
      })
      /**
       * Invalidate products list query to ensure that the products collections are updated.
       */
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCreateCollection = (
  options?: UseMutationOptions<
    { collection: HttpTypes.AdminCollection },
    FetchError,
    HttpTypes.AdminCreateCollection
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.collection.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: collectionsQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteCollection = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.DeleteResponse<"collection">,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.collection.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: collectionsQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: collectionsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
