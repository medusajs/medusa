import { HttpTypes } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"

import { stockLocationsQueryKeys } from "../../../hooks/api/stock-locations"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const fulfillmentSetCreateQuery = (id: string) => ({
  queryKey: stockLocationsQueryKeys.detail(id, {
    fields: "*fulfillment_sets",
  }),
  queryFn: async () =>
    sdk.admin.stockLocation.retrieve(id, {
      fields: "*fulfillment_sets",
    }),
})

export const stockLocationLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.location_id
  const query = fulfillmentSetCreateQuery(id!)

  return (
    queryClient.getQueryData<HttpTypes.AdminStockLocationResponse>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
