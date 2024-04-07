import { AdminProductsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { LoaderFunctionArgs } from "react-router-dom"

import { queryClient } from "../../../lib/medusa"
import { productsQueryKeys } from "../../../hooks/api/products"
import { client } from "../../../lib/client"

const productDetailQuery = (id: string) => ({
  queryKey: productsQueryKeys.detail(id),
  queryFn: async () => client.products.retrieve(id),
})

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = productDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminProductsRes>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
