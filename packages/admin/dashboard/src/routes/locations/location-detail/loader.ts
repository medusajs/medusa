import { HttpTypes } from "@medusajs/types"
import { LoaderFunctionArgs, redirect } from "react-router-dom"

import { FetchError } from "@medusajs/js-sdk"
import { stockLocationsQueryKeys } from "../../../hooks/api/stock-locations"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { detailsFields } from "./const"

const locationQuery = (id: string) => ({
  queryKey: stockLocationsQueryKeys.detail(id),
  queryFn: async () => {
    return await sdk.admin.stockLocation
      .retrieve(id, {
        fields: detailsFields,
      })
      .catch((error: FetchError) => {
        if (error.status === 401) {
          throw redirect("/login")
        }

        throw error
      })
  },
})

export const locationLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.location_id
  const query = locationQuery(id!)

  return (
    queryClient.getQueryData<{ stock_location: HttpTypes.AdminStockLocation }>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
