import { FetchError } from "@medusajs/js-sdk"
import { LoaderFunctionArgs, redirect } from "react-router-dom"

import { HttpTypes } from "@medusajs/types"
import { stockLocationsQueryKeys } from "../../../hooks/api/stock-locations"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { LOCATION_LIST_FIELDS } from "./constants"

const shippingListQuery = () => ({
  queryKey: stockLocationsQueryKeys.lists(),
  queryFn: async () => {
    return await sdk.admin.stockLocation
      .list({
        // TODO: change this when RQ is fixed
        fields: LOCATION_LIST_FIELDS,
      })
      .catch((error: FetchError) => {
        if (error.status === 401) {
          throw redirect("/login")
        }

        throw error
      })
  },
})

export const shippingListLoader = async (_: LoaderFunctionArgs) => {
  const query = shippingListQuery()

  return (
    queryClient.getQueryData<HttpTypes.AdminStockLocationListResponse>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
