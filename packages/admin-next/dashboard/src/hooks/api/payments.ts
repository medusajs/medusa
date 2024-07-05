import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { PaymentProvidersListRes } from "../../types/api-responses"
import { client } from "../../lib/client"

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
