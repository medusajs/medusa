import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

import { AdminGetPromotionsParams } from "@medusajs/medusa"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { PromotionListRes, PromotionRes } from "../../types/api-responses"

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

export const usePromotions = (
  query?: AdminGetPromotionsParams,
  options?: Omit<
    UseQueryOptions<PromotionListRes, Error, PromotionListRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: promotionsQueryKeys.list(query),
    queryFn: async () => client.promotions.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
