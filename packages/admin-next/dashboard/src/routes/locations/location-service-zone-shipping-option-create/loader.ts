import { LoaderFunctionArgs } from "react-router-dom"

import { HttpTypes } from "@medusajs/types"
import { stockLocationsQueryKeys } from "../../../hooks/api/stock-locations"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { LOC_CREATE_SHIPPING_OPTION_FIELDS } from "./constants"

const fulfillmentSetCreateQuery = (id: string) => ({
  queryKey: stockLocationsQueryKeys.detail(id, {
    fields: LOC_CREATE_SHIPPING_OPTION_FIELDS,
  }),
  queryFn: async () =>
    sdk.admin.stockLocation.retrieve(id, {
      fields: LOC_CREATE_SHIPPING_OPTION_FIELDS,
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
