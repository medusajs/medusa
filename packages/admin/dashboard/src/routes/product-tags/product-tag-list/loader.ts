import { HttpTypes } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"

import { productTagsQueryKeys } from "../../../hooks/api"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const QUERY_PREFIX = "ptag_"

const productTagListQuery = (query?: HttpTypes.AdminProductTagListParams) => ({
  queryKey: productTagsQueryKeys.list(query),
  queryFn: async () => sdk.admin.productTag.list(query),
})

export const productTagListLoader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams

  const queryObject: Record<string, string> = {}

  searchParams.forEach((value, key) => {
    const field = key.startsWith(QUERY_PREFIX)
      ? key.slice(QUERY_PREFIX.length)
      : key

    try {
      queryObject[field] = JSON.parse(value)
    } catch (_e) {
      queryObject[field] = value
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
