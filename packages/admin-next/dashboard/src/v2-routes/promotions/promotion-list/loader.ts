import { AdminPromotionsListRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { QueryClient } from "@tanstack/react-query"
import { adminPromotionKeys, useV2Promotions } from "../../../lib/api-v2"
import { queryClient } from "../../../lib/medusa"

const promotionsListQuery = () => ({
  queryKey: adminPromotionKeys.list(),
  queryFn: async () => useV2Promotions({ limit: 20, offset: 0 }),
})

export const promotionsLoader = (client: QueryClient) => {
  return async () => {
    const query = promotionsListQuery()

    return (
      queryClient.getQueryData<Response<AdminPromotionsListRes>>(
        query.queryKey
      ) ?? (await client.fetchQuery(query))
    )
  }
}
