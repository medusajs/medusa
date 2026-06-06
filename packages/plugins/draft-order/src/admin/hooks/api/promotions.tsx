import { FetchError } from "@zjedene-medusa/js-sdk"
import { HttpTypes } from "@zjedene-medusa/types"
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../lib/queries/sdk"

const PROMOTION_QUERY_KEY = "promotions"

export const promotionsQueryKeys = {
  list: (query?: Record<string, any>) => [
    PROMOTION_QUERY_KEY,
    query ? query : undefined,
  ],
  detail: (id: string, query?: Record<string, any>) => [
    PROMOTION_QUERY_KEY,
    id,
    query ? query : undefined,
  ],
}

export const usePromotions = (
  query?: HttpTypes.AdminGetPromotionsParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminPromotionListResponse,
      FetchError,
      HttpTypes.AdminPromotionListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: promotionsQueryKeys.list(query),
    queryFn: async () => sdk.admin.promotion.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
