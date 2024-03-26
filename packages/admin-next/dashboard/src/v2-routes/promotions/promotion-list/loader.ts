import { AdminPromotionsListRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { QueryClient } from "@tanstack/react-query"

import { adminPromotionKeys } from "../../../lib/api-v2"
import { medusa, queryClient } from "../../../lib/medusa"

const promotionsListQuery = () => ({
  queryKey: adminPromotionKeys.list({ limit: 20, offset: 0 }),
  // Question: whats the v2 equivalenet of this?
  queryFn: async () => medusa.admin.discounts.list({ limit: 20, offset: 0 }),
})

// Question: Are we using this anywhere magically? Can this file be removed?
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
