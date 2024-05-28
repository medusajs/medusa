import { LoaderFunctionArgs } from "react-router-dom"

import { stockLocationsQueryKeys } from "../../../hooks/api/stock-locations"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { StockLocationRes } from "../../../types/api-responses"

const fulfillmentSetCreateQuery = (id: string) => ({
  queryKey: stockLocationsQueryKeys.detail(id, {
    fields:
      "*fulfillment_sets,*fulfillment_sets.service_zones,*fulfillment_sets.service_zones.shipping_options",
  }),
  queryFn: async () =>
    client.stockLocations.retrieve(id, {
      fields:
        "*fulfillment_sets,*fulfillment_sets.service_zones,*fulfillment_sets.service_zones.shipping_options",
    }),
})

export const stockLocationLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.location_id
  const query = fulfillmentSetCreateQuery(id!)

  return (
    queryClient.getQueryData<StockLocationRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
