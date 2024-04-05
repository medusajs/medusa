import { LoaderFunctionArgs } from "react-router-dom"

import { apiKeysQueryKeys } from "../../../hooks/api/api-keys"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/medusa"
import { ApiKeyRes } from "../../../types/api-responses"

const apiKeyDetailQuery = (id: string) => ({
  queryKey: apiKeysQueryKeys.detail(id),
  queryFn: async () => client.apiKeys.retrieve(id),
})

export const apiKeyLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = apiKeyDetailQuery(id!)

  return (
    queryClient.getQueryData<ApiKeyRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
