import { QueryClient } from "@tanstack/react-query"

import { HttpTypes } from "@zjedene-medusa/types"
import { productsQueryKeys } from "../../../hooks/api/products"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const productsListQuery = () => ({
  queryKey: productsQueryKeys.list({
    limit: 20,
    offset: 0,
    is_giftcard: false,
  }),
  queryFn: async () =>
    sdk.admin.product.list({ limit: 20, offset: 0, is_giftcard: false }),
})

export const productsLoader = (client: QueryClient) => {
  return async () => {
    const query = productsListQuery()

    return (
      queryClient.getQueryData<HttpTypes.AdminProductListResponse>(
        query.queryKey
      ) ?? (await client.fetchQuery(query))
    )
  }
}
