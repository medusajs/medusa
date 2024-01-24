import { AdminPublishableApiKeysRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { adminProductKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { medusa, queryClient } from "../../../lib/medusa"

const apiKeyDetailQuery = (id: string) => ({
  queryKey: adminProductKeys.detail(id),
  queryFn: async () => medusa.admin.publishableApiKeys.retrieve(id),
})

export const apiKeyLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = apiKeyDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminPublishableApiKeysRes>>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
