import { LoaderFunctionArgs } from "react-router-dom"

import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/medusa"
import { StockLocationListRes } from "../../../types/api-responses"

const shippingListQuery = () => ({
  queryKey: ["shipping_list"],
  queryFn: async () =>
    client.stockLocations.list({ fields: "*fulfillment_sets" }),
})

export const shippingListLoader = async (_: LoaderFunctionArgs) => {
  const query = shippingListQuery()

  return (
    queryClient.getQueryData<StockLocationListRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
