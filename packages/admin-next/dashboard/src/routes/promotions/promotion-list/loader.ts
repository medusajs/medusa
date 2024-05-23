import { QueryClient } from "@tanstack/react-query"
import { promotionsQueryKeys } from "../../../hooks/api/promotions"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { PromotionListRes } from "../../../types/api-responses"

const params = {
  limit: 20,
  offset: 0,
}

const promotionsListQuery = () => ({
  queryKey: promotionsQueryKeys.list(params),
  queryFn: async () => client.promotions.list(params),
})

export const promotionsLoader = (client: QueryClient) => {
  return async () => {
    const query = promotionsListQuery()

    return (
      queryClient.getQueryData<PromotionListRes>(query.queryKey) ??
      (await client.fetchQuery(query))
    )
  }
}
