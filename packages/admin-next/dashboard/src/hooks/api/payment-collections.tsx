import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { ordersQueryKeys } from "./orders"

const PAYMENT_COLLECTION_QUERY_KEY = "payment-collection" as const
export const paymentCollectionQueryKeys = queryKeysFactory(
  PAYMENT_COLLECTION_QUERY_KEY
)

export const useCreatePaymentCollection = (
  options?: UseMutationOptions<
    HttpTypes.AdminPaymentCollectionResponse,
    Error,
    HttpTypes.AdminCreatePaymentCollection
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.paymentCollection.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.all,
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeletePaymentCollection = (
  options?: Omit<
    UseMutationOptions<
      HttpTypes.AdminDeletePaymentCollectionResponse,
      FetchError,
      string
    >,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: (id: string) => sdk.admin.paymentCollection.delete(id),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.all,
      })

      await queryClient.invalidateQueries({
        queryKey: paymentCollectionQueryKeys.all,
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
