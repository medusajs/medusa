import { LoaderFunctionArgs } from "react-router-dom"

import { productsQueryKeys } from "../../../hooks/api/products"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { UserRes } from "../../../types/api-responses"

const userDetailQuery = (id: string) => ({
  queryKey: productsQueryKeys.detail(id),
  queryFn: async () => sdk.admin.user.retrieve(id),
})

export const userLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = userDetailQuery(id!)

  return (
    queryClient.getQueryData<UserRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
