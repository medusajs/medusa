import { adminProductKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/medusa"
import { UserRes } from "../../../types/api-responses"

const userDetailQuery = (id: string) => ({
  queryKey: adminProductKeys.detail(id),
  queryFn: async () => client.users.retrieve(id),
})

export const userLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = userDetailQuery(id!)

  return (
    queryClient.getQueryData<UserRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
