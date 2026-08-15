import { HttpTypes } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"

import { productTagsQueryKeys } from "../../../hooks/api"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const productTagListQuery = (query?: HttpTypes.AdminProductTagListParams) => ({
  queryKey: productTagsQueryKeys.list(query),
  queryFn: async () => sdk.admin.productTag.list(query),
})

/**
 * The parameters `GET /admin/product-tags` accepts, which is the same set
 * `useProductTagTableQuery` reads for the table this loader seeds.
 *
 * The URL also carries UI-owned state the API has no field for: with
 * `view_configurations` enabled the configurable table writes its own under a
 * `ptag_` prefix (`queryPrefix` in the table adapter), and Zod rejects the
 * whole request on the first unrecognized field. Forwarding only what the
 * endpoint declares keeps that state out without needing to know every prefix
 * the UI might introduce.
 */
const LIST_PARAMS = [
  "offset",
  "limit",
  "q",
  "order",
  "created_at",
  "updated_at",
] as const

export const productTagListLoader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams

  const queryObject: Record<string, unknown> = {}

  for (const key of LIST_PARAMS) {
    const value = searchParams.get(key)

    if (value === null) {
      continue
    }

    try {
      queryObject[key] = JSON.parse(value)
    } catch (_e) {
      queryObject[key] = value
    }
  }

  const query = productTagListQuery(
    queryObject as HttpTypes.AdminProductTagListParams
  )

  return (
    queryClient.getQueryData<any>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
