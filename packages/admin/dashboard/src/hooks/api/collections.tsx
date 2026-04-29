import { FetchError } from "@medusajs/js-sdk"
import { FindParams, HttpTypes, PaginatedResponse } from "@medusajs/types"
import {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { productsQueryKeys } from "./products"
import { useInfiniteList } from "../use-infinite-list"

const COLLECTION_QUERY_KEY = "collections" as const
export const collectionsQueryKeys = queryKeysFactory(COLLECTION_QUERY_KEY)

export const useCollection = (
  id: string,
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
    queryFn: async () => sdk.admin.productCollection.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCollections = (
  query?: FindParams & HttpTypes.AdminCollectionListParams,
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
    queryFn: async () => sdk.admin.productCollection.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useInfiniteCollections = (
  query?: Omit<HttpTypes.AdminCollectionListParams, "offset" | "limit"> & {
    limit?: number
  },
  options?: Omit<
    UseInfiniteQueryOptions<
      HttpTypes.AdminCollectionListResponse,
      FetchError,
      InfiniteData<HttpTypes.AdminCollectionListResponse, number>,
      HttpTypes.AdminCollectionListResponse,
      QueryKey,
      number
    >,
    "queryFn" | "queryKey" | "initialPageParam" | "getNextPageParam"
  >
) => {
  return useInfiniteList<
    HttpTypes.AdminCollectionListResponse,
    HttpTypes.AdminCollectionListParams,
    FetchError,
    QueryKey
  >({
    queryKey: (params) => collectionsQueryKeys.list(params),
    queryFn: (params) => sdk.admin.productCollection.list(params),
    query,
    options,
  })
}
export const useUpdateCollection = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminCollectionResponse,
    FetchError,
    HttpTypes.AdminUpdateCollection
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.productCollection.update(id, payload),
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
    HttpTypes.AdminCollectionResponse,
    FetchError,
    HttpTypes.AdminUpdateCollectionProducts
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.productCollection.updateProducts(id, payload),
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
    HttpTypes.AdminCollectionResponse,
    FetchError,
    HttpTypes.AdminCreateCollection
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.productCollection.create(payload),
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
    HttpTypes.AdminCollectionDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.productCollection.delete(id),
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
