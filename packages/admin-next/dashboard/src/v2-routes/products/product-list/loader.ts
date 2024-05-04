import { AdminProductsListRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { QueryClient } from "@tanstack/react-query"

import { medusa, queryClient } from "../../../lib/medusa"
import { productsQueryKeys } from "../../../hooks/api/products"

const productsListQuery = () => ({
  queryKey: productsQueryKeys.list({ limit: 20, offset: 0 }),
  queryFn: async () => medusa.admin.products.list({ limit: 20, offset: 0 }),
})

export const productsLoader = (client: QueryClient) => {
  return async () => {
    const query = productsListQuery()

    return (
      queryClient.getQueryData<Response<AdminProductsListRes>>(
        query.queryKey
      ) ?? (await client.fetchQuery(query))
    )
  }
}
