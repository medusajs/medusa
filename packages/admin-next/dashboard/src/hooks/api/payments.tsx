import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import { client, sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { PaymentProvidersListRes } from "../../types/api-responses"
import { ordersQueryKeys } from "./orders"

export const usePaymentProviders = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      PaymentProvidersListRes,
      Error,
      PaymentProvidersListRes,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => client.payments.listPaymentProviders(query),
    queryKey: [],
    ...options,
  })

  return { ...data, ...rest }
}

export const useCapturePayment = (
  paymentId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminPaymentResponse,
    Error,
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
        queryKey: ordersQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
