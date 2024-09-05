import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"

import { FetchError } from "@medusajs/js-sdk"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const RETURN_REASONS_QUERY_KEY = "return_reasons" as const
export const returnReasonsQueryKeys = queryKeysFactory(RETURN_REASONS_QUERY_KEY)

export const useReturnReasons = (
  query?: HttpTypes.AdminReturnReasonListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminReturnReasonListResponse,
      FetchError,
      HttpTypes.AdminReturnReasonListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.returnReason.list(query),
    queryKey: returnReasonsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useReturnReason = (
  id: string,
  query?: HttpTypes.AdminReturnReasonParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminReturnReasonResponse,
      FetchError,
      HttpTypes.AdminReturnReasonResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.returnReason.retrieve(id, query),
    queryKey: returnReasonsQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateReturnReason = (
  query?: HttpTypes.AdminReturnReasonParams,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnReasonResponse,
    FetchError,
    HttpTypes.AdminCreateReturnReason
  >
) => {
  return useMutation({
    mutationFn: async (data) => sdk.admin.returnReason.create(data, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: returnReasonsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
export const useUpdateReturnReason = (
  id: string,
  query?: HttpTypes.AdminReturnReasonParams,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnReasonResponse,
    FetchError,
    HttpTypes.AdminUpdateReturnReason
  >
) => {
  return useMutation({
    mutationFn: async (data) => sdk.admin.returnReason.update(id, data, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: returnReasonsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: returnReasonsQueryKeys.detail(data.return_reason.id, query),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteReturnReason = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnReasonDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.returnReason.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: returnReasonsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: returnReasonsQueryKeys.detail(id),
      })

      queryClient.invalidateQueries({
        queryKey: returnReasonsQueryKeys.details(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
