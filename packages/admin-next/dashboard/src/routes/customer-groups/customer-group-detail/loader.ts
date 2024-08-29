import { HttpTypes } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"
import { productsQueryKeys } from "../../../hooks/api/products"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const customerGroupDetailQuery = (id: string) => ({
  queryKey: productsQueryKeys.detail(id),
  queryFn: async () =>
    sdk.admin.customerGroup.retrieve(id, {
      fields: "+customers.id",
    }),
})

export const customerGroupLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = customerGroupDetailQuery(id!)

  return (
    queryClient.getQueryData<{
      customer_group: HttpTypes.AdminCustomerGroup
    }>(query.queryKey) ?? (await queryClient.fetchQuery(query))
  )
}
