import { HttpTypes } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"

import { productTagsQueryKeys } from "../../../hooks/api"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const productTagListQuery = (query?: HttpTypes.AdminProductTagListParams) => ({
  queryKey: productTagsQueryKeys.list(query),
  queryFn: async () => sdk.admin.productTag.list(query),
})

// Must match the queryPrefix of the table adapter in
// ./components/product-tag-list-table/product-tag-table-adapter.tsx
const QUERY_PREFIX = "ptag"

export const productTagListLoader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams

  const queryObject: Record<string, string> = {}

  searchParams.forEach((value, key) => {
    // The configurable table stores its params in the URL with a prefix
    // (e.g. `ptag_order`), which the API does not accept. Strip it before
    // forwarding the params to the API.
    const paramKey = key.startsWith(`${QUERY_PREFIX}_`)
      ? key.slice(QUERY_PREFIX.length + 1)
      : key

    try {
      queryObject[paramKey] = JSON.parse(value)
    } catch (_e) {
      queryObject[paramKey] = value
    }
  })

  const query = productTagListQuery(
    queryObject as HttpTypes.AdminProductTagListParams
  )

  return (
    queryClient.getQueryData<any>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
