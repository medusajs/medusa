import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { HttpTypes } from "@medusajs/types"
import { queryClient } from "../../lib/query-client.ts"

const PRODUCT_OPTIONS_QUERY_KEY = "product_options" as const
export const productOptionsQueryKeys = queryKeysFactory(
  PRODUCT_OPTIONS_QUERY_KEY
)

const PRODUCT_OPTION_VALUES_QUERY_KEY = "product_option_values" as const
export const productOptionValuesQueryKeys = queryKeysFactory(
  PRODUCT_OPTION_VALUES_QUERY_KEY
)

// The option and option-value caches are interdependent: the values table reads
// the value list endpoint (`product_option_values`), while the option detail and
// edit views embed the option's `values` (`product_options`). A change made
// through either entry point must refresh BOTH namespaces, otherwise the other
// view keeps rendering a stale value list.
const invalidateProductOptionQueries = (optionId?: string) => {
  queryClient.invalidateQueries({
    queryKey: productOptionsQueryKeys.lists(),
  })
  queryClient.invalidateQueries({
    queryKey: optionId
      ? productOptionsQueryKeys.detail(optionId)
      : productOptionsQueryKeys.details(),
  })
  queryClient.invalidateQueries({
    queryKey: productOptionValuesQueryKeys.lists(),
  })
  queryClient.invalidateQueries({
    queryKey: productOptionValuesQueryKeys.details(),
  })
}

export const useProductOption = (
  id: string,
  query?: HttpTypes.AdminProductOptionParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminProductOptionResponse,
      FetchError,
      HttpTypes.AdminProductOptionResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: productOptionsQueryKeys.detail(id, query),
    queryFn: () => sdk.admin.productOption.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useProductOptions = (
  query?: HttpTypes.AdminProductOptionListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminProductOptionListResponse,
      FetchError,
      HttpTypes.AdminProductOptionListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.productOption.list(query),
    queryKey: productOptionsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateProductOption = (
  options?: UseMutationOptions<
    HttpTypes.AdminProductOptionResponse,
    FetchError,
    HttpTypes.AdminCreateProductOption
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.productOption.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: productOptionsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateProductOption = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminProductOptionResponse,
    FetchError,
    HttpTypes.AdminUpdateProductOption
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.productOption.update(id, payload),
    onSuccess: (data, variables, context) => {
      invalidateProductOptionQueries(id)

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteProductOption = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminProductOptionDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.productOption.delete(id),
    onSuccess: (data, variables, context) => {
      invalidateProductOptionQueries(id)

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteProductOptionLazy = (
  options?: UseMutationOptions<
    HttpTypes.AdminProductOptionDeleteResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (id: string) => sdk.admin.productOption.delete(id),
    onSuccess: (data, variables, context) => {
      invalidateProductOptionQueries()

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useProductOptionValues = (
  optionId: string,
  query?: HttpTypes.AdminProductOptionValueListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminProductOptionValueListResponse,
      FetchError,
      HttpTypes.AdminProductOptionValueListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: productOptionValuesQueryKeys.list({ optionId, ...query }),
    queryFn: () => sdk.admin.productOption.listValues(optionId, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useProductOptionValue = (
  optionId: string,
  valueId: string,
  query?: HttpTypes.SelectParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminProductOptionValueResponse,
      FetchError,
      HttpTypes.AdminProductOptionValueResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: productOptionValuesQueryKeys.detail(valueId, query),
    queryFn: () =>
      sdk.admin.productOption.retrieveValue(optionId, valueId, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateProductOptionValue = (
  optionId: string,
  valueId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminProductOptionValueResponse,
    FetchError,
    HttpTypes.AdminUpdateProductOptionValue
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.productOption.updateValue(optionId, valueId, payload),
    onSuccess: (data, variables, context) => {
      invalidateProductOptionQueries(optionId)

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteProductOptionValue = (
  optionId: string,
  valueId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminProductOptionValueDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.productOption.deleteValue(optionId, valueId),
    onSuccess: (data, variables, context) => {
      invalidateProductOptionQueries(optionId)

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteProductOptionValueLazy = (
  optionId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminProductOptionValueDeleteResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (valueId: string) =>
      sdk.admin.productOption.deleteValue(optionId, valueId),
    onSuccess: (data, variables, context) => {
      invalidateProductOptionQueries(optionId)

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
