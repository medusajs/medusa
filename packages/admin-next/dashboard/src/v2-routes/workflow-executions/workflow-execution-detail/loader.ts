import { AdminProductsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { adminProductKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { medusa, queryClient } from "../../../lib/medusa"

const executionDetailQuery = (id: string) => ({
  queryKey: adminProductKeys.detail(id),
  queryFn: async () => medusa.admin.custom.get(`/workflows-executions/${id}`),
})

export const executionLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = executionDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminProductsRes>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
