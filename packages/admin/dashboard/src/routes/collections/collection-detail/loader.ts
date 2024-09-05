import { HttpTypes } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"

import { collectionsQueryKeys } from "../../../hooks/api/collections"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const collectionDetailQuery = (id: string) => ({
  queryKey: collectionsQueryKeys.detail(id),
  queryFn: async () => sdk.admin.productCollection.retrieve(id),
})

export const collectionLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = collectionDetailQuery(id!)

  return (
    queryClient.getQueryData<{ collection: HttpTypes.AdminCollection }>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
