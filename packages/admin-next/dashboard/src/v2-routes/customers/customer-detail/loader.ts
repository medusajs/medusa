import { Response } from "@medusajs/medusa-js"
import { AdminCustomerResponse } from "@medusajs/types"
import { adminProductKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"
import { medusa, queryClient } from "../../../lib/medusa"

const customerDetailQuery = (id: string) => ({
  queryKey: adminProductKeys.detail(id),
  queryFn: async () => medusa.admin.customers.retrieve(id),
})

export const customerLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = customerDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminCustomerResponse>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
