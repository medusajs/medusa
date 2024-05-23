import { LoaderFunctionArgs } from "react-router-dom"

import { ordersQueryKeys } from "../../../hooks/api/orders"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { OrderRes } from "../../../types/api-responses"
import { DEFAULT_FIELDS } from "./constants"

const orderDetailQuery = (id: string) => ({
  queryKey: ordersQueryKeys.detail(id),
  queryFn: async () =>
    client.orders.retrieve(id, {
      fields: DEFAULT_FIELDS,
    }),
})

export const orderLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = orderDetailQuery(id!)

  return (
    queryClient.getQueryData<OrderRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
