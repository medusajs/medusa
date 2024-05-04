import { AdminDraftOrdersRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { adminDraftOrderKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { medusa, queryClient } from "../../../lib/medusa"

const draftOrderDetailQuery = (id: string) => ({
  queryKey: adminDraftOrderKeys.detail(id),
  queryFn: async () => medusa.admin.draftOrders.retrieve(id),
})

export const draftOrderLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = draftOrderDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminDraftOrdersRes>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
