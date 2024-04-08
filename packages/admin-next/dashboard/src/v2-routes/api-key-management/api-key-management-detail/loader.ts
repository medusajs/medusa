import { LoaderFunctionArgs } from "react-router-dom"

import { AdminApiKeyResponse } from "@medusajs/types"
import { apiKeysQueryKeys } from "../../../hooks/api/api-keys"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/medusa"

const apiKeyDetailQuery = (id: string) => ({
  queryKey: apiKeysQueryKeys.detail(id),
  queryFn: async () => client.apiKeys.retrieve(id),
})

export const apiKeyLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = apiKeyDetailQuery(id!)

  return (
    queryClient.getQueryData<AdminApiKeyResponse>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
