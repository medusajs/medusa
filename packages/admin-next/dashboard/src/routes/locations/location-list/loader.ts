import { LoaderFunctionArgs } from "react-router-dom"

import { stockLocationsQueryKeys } from "../../../hooks/api/stock-locations"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { StockLocationListRes } from "../../../types/api-responses"
import { locationListFields } from "./const"

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
