import { AdminUserRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { adminProductKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { medusa, queryClient } from "../../../lib/medusa"

const userDetailQuery = (id: string) => ({
  queryKey: adminProductKeys.detail(id),
  queryFn: async () => medusa.admin.users.retrieve(id),
})

export const userLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = userDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminUserRes>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
