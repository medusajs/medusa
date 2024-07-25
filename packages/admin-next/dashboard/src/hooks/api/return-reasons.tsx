import { HttpTypes } from "@medusajs/types"
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

import { sdk } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const RETURN_REASONS_QUERY_KEY = "return_reasons" as const
export const returnReasonQueryKeys = queryKeysFactory(RETURN_REASONS_QUERY_KEY)

export const useReturnReasons = (
  query?: HttpTypes.AdminReturnReasonListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminReturnReasonsResponse,
      Error,
      HttpTypes.AdminReturnReasonsResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.returnReason.list(query),
    queryKey: returnReasonQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
