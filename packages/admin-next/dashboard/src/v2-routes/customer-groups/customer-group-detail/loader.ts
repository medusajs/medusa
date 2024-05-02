import { Response } from "@medusajs/medusa-js"
import { adminProductKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { AdminCustomerGroupResponse } from "@medusajs/types"
import { medusa, queryClient } from "../../../lib/medusa"

const customerGroupDetailQuery = (id: string) => ({
  queryKey: adminProductKeys.detail(id),
  queryFn: async () =>
    medusa.admin.customerGroups.retrieve(id, {
      fields: "+customers.id",
    }),
})

export const customerGroupLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = customerGroupDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminCustomerGroupResponse>>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
