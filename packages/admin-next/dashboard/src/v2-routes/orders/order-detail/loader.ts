import { AdminOrdersRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { adminOrderKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { queryClient } from "../../../lib/medusa"
import { DEFAULT_FIELDS } from "./constants"
import { client } from "../../../lib/client"

const orderDetailQuery = (id: string) => ({
  queryKey: adminOrderKeys.detail(id),
  queryFn: async () =>
    client.orders.retrieve(id, {
      fields: DEFAULT_FIELDS,
    }),
})

export const orderLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = orderDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminOrdersRes>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
