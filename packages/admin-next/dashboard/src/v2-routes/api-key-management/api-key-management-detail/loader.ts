import { Response } from "@medusajs/medusa-js"
import { adminPublishableApiKeysKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { ApiKeyDTO } from "@medusajs/types"
import { medusa, queryClient } from "../../../lib/medusa"

const apiKeyDetailQuery = (id: string) => ({
  queryKey: adminPublishableApiKeysKeys.detail(id),
  queryFn: async () => medusa.admin.custom.get(`/api-keys/${id}`),
})

export const apiKeyLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = apiKeyDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<{ api_key: ApiKeyDTO }>>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
