import { AdminOrdersRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { adminOrderKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { medusa, queryClient } from "../../../lib/medusa"
import { orderExpand } from "../order-detail/constants"

const orderEditQuery = (id: string) => ({
  queryKey: adminOrderKeys.detail(id),
  queryFn: async () =>
    medusa.admin.orders.retrieve(id, {
      expand: orderExpand,
    }),
})

export const orderLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = orderEditQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminOrdersRes>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
