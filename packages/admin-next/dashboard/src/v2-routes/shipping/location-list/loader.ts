import { LoaderFunctionArgs } from "react-router-dom"
import { adminStockLocationsKeys } from "medusa-react"

import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/medusa"
import { StockLocationListRes } from "../../../types/api-responses"

const shippingListQuery = () => ({
  queryKey: adminStockLocationsKeys.lists(),
  queryFn: async () =>
    client.stockLocations.list({
      // fields: "*fulfillment_sets,*fulfillment_sets.service_zones",
      // TODO: change this when RQ is fixed to work with the upper fields definition
      fields:
        "name,address.city,address.country_code,fulfillment_sets.type,fulfillment_sets.name,*fulfillment_sets.service_zones,*fulfillment_sets.service_zones.shipping_options,*fulfillment_sets.service_zones.shipping_options.shipping_profile",
    }),
})

export const shippingListLoader = async (_: LoaderFunctionArgs) => {
  const query = shippingListQuery()

  return (
    queryClient.getQueryData<StockLocationListRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
