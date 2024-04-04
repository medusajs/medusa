import {
  AdminGetPromotionsParams,
  AdminPromotionsListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { QueryClient } from "@tanstack/react-query"
import { adminPromotionKeys } from "../../../lib/api-v2"
import { medusa, queryClient } from "../../../lib/medusa"

const params = {
  limit: 20,
  offset: 0,
}

const promotionsListQuery = () => ({
  queryKey: adminPromotionKeys.list(params),
  queryFn: async () =>
    medusa.admin.custom.get<AdminGetPromotionsParams, AdminPromotionsListRes>(
      "/promotions",
      params
    ),
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
