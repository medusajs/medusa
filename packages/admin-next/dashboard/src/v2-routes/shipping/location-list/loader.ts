import { LoaderFunctionArgs } from "react-router-dom"

import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/medusa"
import { StockLocationListRes } from "../../../types/api-responses"
import { locationListFields } from "./const"
import { stockLocationsQueryKeys } from "../../../hooks/api/stock-locations"

const shippingListQuery = () => ({
  queryKey: stockLocationsQueryKeys.lists(),
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
