import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { ordersQueryKeys } from "./orders"
import { FetchError } from "@medusajs/js-sdk"

const PAYMENT_QUERY_KEY = "payment" as const
export const paymentQueryKeys = queryKeysFactory(PAYMENT_QUERY_KEY)

export const usePaymentProviders = (
  query?: HttpTypes.AdminGetPaymentProvidersParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminGetPaymentProvidersParams,
      FetchError,
      HttpTypes.AdminPaymentProviderListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.payment.listPaymentProviders(query),
    queryKey: [],
    ...options,
  })

  return { ...data, ...rest }
}

export const usePayment = (
  id: string,
  query?: HttpTypes.AdminPaymentFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminPaymentResponse,
      FetchError,
      HttpTypes.AdminPaymentResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.payment.retrieve(id, query),
    queryKey: paymentQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCapturePayment = (
  orderId: string,
  paymentId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminPaymentResponse,
    FetchError,
    HttpTypes.AdminCapturePayment
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.payment.capture(paymentId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useRefundPayment = (
  orderId: string,
  paymentId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminPaymentResponse,
    FetchError,
    HttpTypes.AdminRefundPayment
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.payment.refund(paymentId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
