import { Response } from "@medusajs/medusa-js"
import { AdminStockLocationResponse } from "@medusajs/types"
import { adminStockLocationsKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { medusa, queryClient } from "../../../lib/medusa"

const locationQuery = (id: string) => ({
  queryKey: adminStockLocationsKeys.detail(id),
  queryFn: async () =>
    medusa.admin.stockLocations.retrieve(id, {
      fields:
        "name,address.city,address.country_code,fulfillment_sets.type,fulfillment_sets.name,*fulfillment_sets.service_zones,*fulfillment_sets.service_zones.shipping_options,*fulfillment_sets.service_zones.shipping_options.shipping_profile",
    }),
})

export const locationLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.location_id
  const query = locationQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminStockLocationResponse>>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
