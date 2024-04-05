import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { PromotionRes } from "../../types/api-responses"

const PROMOTIONS_QUERY_KEY = "promotions" as const
const promotionsQueryKeys = queryKeysFactory(PROMOTIONS_QUERY_KEY)

export const usePromotion = (
  id: string,
  options?: Omit<
    UseQueryOptions<PromotionRes, Error, PromotionRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: promotionsQueryKeys.detail(id),
    queryFn: async () => client.promotions.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}
