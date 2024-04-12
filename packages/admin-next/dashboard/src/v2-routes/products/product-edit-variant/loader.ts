import { LoaderFunctionArgs } from "react-router-dom"

import { queryClient } from "../../../lib/medusa"
import { productsQueryKeys } from "../../../hooks/api/products"
import { client } from "../../../lib/client"

const queryKey = (id: string) => {
  return [productsQueryKeys.detail(id)]
}

const queryFn = async (id: string) => {
  const productRes = await client.products.retrieve(id)
  return {
    initialData: productRes,
    isStockAndInventoryEnabled: false,
  }
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
