import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import {
  ProductDeleteRes,
  ProductListRes,
  ProductRes,
} from "../../types/api-responses"
import { queryClient } from "../../lib/medusa"

const PRODUCTS_QUERY_KEY = "products" as const
export const productsQueryKeys = queryKeysFactory(PRODUCTS_QUERY_KEY)

const VARIANTS_QUERY_KEY = "product_variants" as const
export const variantsQueryKeys = queryKeysFactory(VARIANTS_QUERY_KEY)

export const useProductVariant = (
  productId: string,
  variantId: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<any, Error, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.products.retrieveVariant(productId, variantId, query),
    queryKey: variantsQueryKeys.detail(variantId),
    ...options,
  })

  return { ...data, ...rest }
}

export const useProductVariants = (
  productId: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<any, Error, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.products.listVariants(productId, query),
    queryKey: variantsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useDeleteVariant = (
  productId: string,
  variantId: string,
  options?: UseMutationOptions<any, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.products.deleteVariant(productId, variantId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: variantsQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: variantsQueryKeys.detail(variantId),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

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

export const useCreateProduct = (
  options?: UseMutationOptions<ProductRes, Error, any>
) => {
  return useMutation({
    mutationFn: (payload: any) => client.products.create(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateProduct = (
  id: string,
  options?: UseMutationOptions<ProductRes, Error, any>
) => {
  return useMutation({
    mutationFn: (payload: any) => client.products.update(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteProduct = (
  id: string,
  options?: UseMutationOptions<ProductDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.products.delete(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
