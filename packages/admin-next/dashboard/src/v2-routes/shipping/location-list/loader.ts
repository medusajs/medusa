import { LoaderFunctionArgs } from "react-router-dom"
import { adminStockLocationsKeys } from "medusa-react"

import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/medusa"
import { StockLocationListRes } from "../../../types/api-responses"
import { locationListFields } from "./const"

const shippingListQuery = () => ({
  queryKey: adminStockLocationsKeys.lists(),
  queryFn: async () =>
    client.stockLocations.list({
      // TODO: change this when RQ is fixed
      fields: locationListFields,
    }),
})

export const shippingListLoader = async (_: LoaderFunctionArgs) => {
  const query = shippingListQuery()

  return (
    queryClient.getQueryData<StockLocationListRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
