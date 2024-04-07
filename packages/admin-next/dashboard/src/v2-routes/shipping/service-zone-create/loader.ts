import { adminStockLocationsKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/medusa"
import { StockLocationRes } from "../../../types/api-responses"

const fulfillmentSetCreateQuery = (id: string) => ({
  queryKey: adminStockLocationsKeys.detail(id),
  queryFn: async () =>
    client.stockLocations.retrieve(id, {
      fields: "*fulfillment_sets",
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
