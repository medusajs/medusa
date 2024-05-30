import { LoaderFunctionArgs } from "react-router-dom"

import { productsQueryKeys } from "../../../hooks/api/products"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const queryKey = (id: string) => {
  return [productsQueryKeys.detail(id)]
}

const queryFn = async (id: string) => {
  return await client.products.retrieve(id)
}

const editProductVariantQuery = (id: string) => ({
  queryKey: queryKey(id),
  queryFn: async () => queryFn(id),
})

export const editProductVariantLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  const id = params.id
  const query = editProductVariantQuery(id!)

  return (
    queryClient.getQueryData<ReturnType<typeof queryFn>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
