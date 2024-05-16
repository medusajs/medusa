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
  CreateProductCollectionReq,
  UpdateProductCollectionProductsReq,
  UpdateProductCollectionReq,
} from "../../types/api-payloads"
import {
  ProductCollectionDeleteRes,
  ProductCollectionListRes,
  ProductCollectionRes,
} from "../../types/api-responses"

const COLLECTION_QUERY_KEY = "collections" as const
export const collectionsQueryKeys = queryKeysFactory(COLLECTION_QUERY_KEY)

export const useCollection = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      ProductCollectionRes,
      Error,
      ProductCollectionRes,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: collectionsQueryKeys.detail(id),
    queryFn: async () => client.collections.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCollections = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      ProductCollectionListRes,
      Error,
      ProductCollectionListRes,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: collectionsQueryKeys.list(query),
    queryFn: async () => client.collections.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateCollection = (
  id: string,
  options?: UseMutationOptions<
    ProductCollectionRes,
    Error,
    UpdateProductCollectionReq
  >
) => {
  return useMutation({
    mutationFn: (payload: UpdateProductCollectionReq) =>
      client.collections.update(id, payload),
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
    ProductCollectionRes,
    Error,
    UpdateProductCollectionProductsReq
  >
) => {
  return useMutation({
    mutationFn: (payload: UpdateProductCollectionProductsReq) =>
      client.collections.updateProducts(id, payload),
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

export const useCreateCollection = (
  options?: UseMutationOptions<
    ProductCollectionRes,
    Error,
    CreateProductCollectionReq
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.collections.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: collectionsQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteCollection = (
  id: string,
  options?: UseMutationOptions<ProductCollectionDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.collections.delete(id),
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
