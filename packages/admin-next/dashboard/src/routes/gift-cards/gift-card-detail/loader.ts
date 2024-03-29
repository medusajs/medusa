import { AdminGiftCardsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { adminProductKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { medusa, queryClient } from "../../../lib/medusa"

const giftCardDetailQuery = (id: string) => ({
  queryKey: adminProductKeys.detail(id),
  queryFn: async () => medusa.admin.giftCards.retrieve(id),
})

export const giftCardLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = giftCardDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminGiftCardsRes>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
