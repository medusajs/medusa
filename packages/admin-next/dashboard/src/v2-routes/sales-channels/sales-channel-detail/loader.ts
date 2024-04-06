import { adminProductKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/medusa"
import { SalesChannelRes } from "../../../types/api-responses"

const salesChannelDetailQuery = (id: string) => ({
  queryKey: adminProductKeys.detail(id),
  queryFn: async () => client.salesChannels.retrieve(id),
})

export const salesChannelLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = salesChannelDetailQuery(id!)

  return (
    queryClient.getQueryData<SalesChannelRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
