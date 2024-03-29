import { AdminPromotionRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { LoaderFunctionArgs } from "react-router-dom"
import { adminPromotionKeys, adminPromotionQueryFns } from "../../../lib/api-v2"
import { queryClient } from "../../../lib/medusa"

const promotionDetailQuery = (id: string) => ({
  queryKey: adminPromotionKeys.detail(id),
  queryFn: () => adminPromotionQueryFns.detail(id),
})

export const promotionLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = promotionDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminPromotionRes>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
