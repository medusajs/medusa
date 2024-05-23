import { AdminStockLocationResponse } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"

import { stockLocationsQueryKeys } from "../../../hooks/api/stock-locations"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const locationQuery = (id: string) => ({
  queryKey: stockLocationsQueryKeys.detail(id),
  queryFn: async () =>
    client.stockLocations.retrieve(id, {
      fields:
        "name,*sales_channels,address.city,address.country_code,fulfillment_sets.type,fulfillment_sets.name,*fulfillment_sets.service_zones.geo_zones,*fulfillment_sets.service_zones,*fulfillment_sets.service_zones.shipping_options,*fulfillment_sets.service_zones.shipping_options.rules,*fulfillment_sets.service_zones.shipping_options.shipping_profile",
    }),
})

export const locationLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.location_id
  const query = locationQuery(id!)

  return (
    queryClient.getQueryData<AdminStockLocationResponse>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
