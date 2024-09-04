import { LoaderFunctionArgs } from "react-router-dom"
import { productsQueryKeys } from "../../../hooks/api/products"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { HttpTypes } from "@medusajs/types"

const customerDetailQuery = (id: string) => ({
  queryKey: productsQueryKeys.detail(id),
  queryFn: async () => sdk.admin.customer.retrieve(id),
})

export const customerLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = customerDetailQuery(id!)

  return (
    queryClient.getQueryData<{ customer: HttpTypes.AdminCustomer }>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
