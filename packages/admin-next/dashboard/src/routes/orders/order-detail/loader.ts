import { LoaderFunctionArgs } from "react-router-dom"

import { HttpTypes } from "@medusajs/types"
import { ordersQueryKeys } from "../../../hooks/api/orders"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { DEFAULT_FIELDS } from "./constants"

const orderDetailQuery = (id: string) => ({
  queryKey: ordersQueryKeys.detail(id),
  queryFn: async () =>
    sdk.admin.order.retrieve(id, {
      fields: DEFAULT_FIELDS,
    }),
})

export const orderLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = orderDetailQuery(id!)

  return (
    queryClient.getQueryData<HttpTypes.AdminOrderResponse>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
