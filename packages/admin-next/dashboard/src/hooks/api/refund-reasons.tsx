import { HttpTypes } from "@medusajs/types"
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { FetchError } from "@medusajs/js-sdk"

const REFUND_REASON_QUERY_KEY = "refund-reason" as const
export const refundReasonQueryKeys = queryKeysFactory(REFUND_REASON_QUERY_KEY)

export const useRefundReasons = (
  query?: HttpTypes.RefundReasonFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.RefundReasonsResponse,
      FetchError,
      HttpTypes.RefundReasonsResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.refundReason.list(query),
    queryKey: [],
    ...options,
  })

  return { ...data, ...rest }
}
