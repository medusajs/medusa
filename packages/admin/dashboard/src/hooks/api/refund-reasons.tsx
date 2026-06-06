import { HttpTypes } from "@zjedene-medusa/types"
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"

import { FetchError } from "@zjedene-medusa/js-sdk"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const REFUND_REASONS_QUERY_KEY = "refund_reasons" as const
export const refundReasonsQueryKeys = queryKeysFactory(REFUND_REASONS_QUERY_KEY)

export const useRefundReasons = (
  query?: HttpTypes.AdminRefundReasonListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminRefundReasonListResponse,
      FetchError,
      HttpTypes.AdminRefundReasonListResponse
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.refundReason.list(query),
    queryKey: refundReasonsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useRefundReason = (
  id: string,
  query?: HttpTypes.AdminRefundReasonParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminRefundReasonResponse,
      FetchError,
      HttpTypes.AdminRefundReasonResponse
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.refundReason.retrieve(id, query),
    queryKey: refundReasonsQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateRefundReason = (
  query?: HttpTypes.AdminRefundReasonParams,
  options?: UseMutationOptions<
    HttpTypes.RefundReasonResponse,
    FetchError,
    HttpTypes.AdminCreateRefundReason
  >
) => {
  return useMutation({
    mutationFn: async (data) => sdk.admin.refundReason.create(data, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: refundReasonsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateRefundReason = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminRefundReasonResponse,
    FetchError,
    HttpTypes.AdminUpdateRefundReason
  >
) => {
  return useMutation({
    mutationFn: async (data) => sdk.admin.refundReason.update(id, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: refundReasonsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: refundReasonsQueryKeys.detail(data.refund_reason.id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteRefundReasonLazy = (
  options?: UseMutationOptions<
    HttpTypes.AdminRefundReasonDeleteResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (id: string) => sdk.admin.refundReason.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: refundReasonsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: refundReasonsQueryKeys.details(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
