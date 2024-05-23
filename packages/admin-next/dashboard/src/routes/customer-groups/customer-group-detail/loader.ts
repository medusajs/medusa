import { LoaderFunctionArgs } from "react-router-dom"

import { AdminCustomerGroupResponse } from "@medusajs/types"
import { productsQueryKeys } from "../../../hooks/api/products"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const customerGroupDetailQuery = (id: string) => ({
  queryKey: productsQueryKeys.detail(id),
  queryFn: async () =>
    client.customerGroups.retrieve(id, {
      fields: "+customers.id",
    }),
})

export const customerGroupLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = customerGroupDetailQuery(id!)

  return (
    queryClient.getQueryData<AdminCustomerGroupResponse>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
