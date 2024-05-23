import { AdminProductCategoryResponse } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"

import { categoriesQueryKeys } from "../../../hooks/api/categories"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const categoryDetailQuery = (id: string) => ({
  queryKey: categoriesQueryKeys.detail(id),
  queryFn: async () => client.categories.retrieve(id),
})

export const categoryLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = categoryDetailQuery(id!)

  return (
    queryClient.getQueryData<AdminProductCategoryResponse>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
