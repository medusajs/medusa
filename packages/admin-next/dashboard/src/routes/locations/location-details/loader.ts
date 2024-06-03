import { AdminStockLocationResponse } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"

import { stockLocationsQueryKeys } from "../../../hooks/api/stock-locations"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { detailsFields } from "./const"

const locationQuery = (id: string) => ({
  queryKey: stockLocationsQueryKeys.detail(id),
  queryFn: async () =>
    client.stockLocations.retrieve(id, {
      fields: detailsFields,
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
