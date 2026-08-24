import { HttpTypes } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"

import { productTagsQueryKeys } from "../../../hooks/api"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { getProductTagListQueryParams } from "./query-params"

const productTagListQuery = (query?: HttpTypes.AdminProductTagListParams) => ({
  queryKey: productTagsQueryKeys.list(query),
  queryFn: async () => sdk.admin.productTag.list(query),
})

export const productTagListLoader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams

  const query = productTagListQuery(getProductTagListQueryParams(searchParams))

  return (
    queryClient.getQueryData<any>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
