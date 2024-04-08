import { LoaderFunctionArgs } from "react-router-dom"

import { collectionsQueryKeys } from "../../../hooks/api/collections"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/medusa"
import { ProductCollectionRes } from "../../../types/api-responses"

const collectionDetailQuery = (id: string) => ({
  queryKey: collectionsQueryKeys.detail(id),
  queryFn: async () => client.collections.retrieve(id),
})

export const collectionLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = collectionDetailQuery(id!)

  return (
    queryClient.getQueryData<ProductCollectionRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
