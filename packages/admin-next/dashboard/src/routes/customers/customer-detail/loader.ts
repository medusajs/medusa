import { AdminCustomerResponse } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"
import { productsQueryKeys } from "../../../hooks/api/products"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const customerDetailQuery = (id: string) => ({
  queryKey: productsQueryKeys.detail(id),
  queryFn: async () => client.customers.retrieve(id),
})

export const customerLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = customerDetailQuery(id!)

  return (
    queryClient.getQueryData<AdminCustomerResponse>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
