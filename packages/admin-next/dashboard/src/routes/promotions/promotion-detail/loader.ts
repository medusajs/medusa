import { LoaderFunctionArgs } from "react-router-dom"
import { promotionsQueryKeys } from "../../../hooks/api/promotions"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { PromotionRes } from "../../../types/api-responses"

const promotionDetailQuery = (id: string) => ({
  queryKey: promotionsQueryKeys.detail(id),
  queryFn: async () => client.promotions.retrieve(id),
})

export const promotionLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = promotionDetailQuery(id!)

  return (
    queryClient.getQueryData<PromotionRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
