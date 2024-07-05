import { QueryClient } from "@tanstack/react-query"

import { Response } from "@medusajs/medusa-js"
import { AdminDiscountsListRes } from "@medusajs/medusa"
import { adminDiscountKeys } from "medusa-react"

import { medusa, queryClient } from "../../../lib/medusa"

const discountsListQuery = () => ({
  queryKey: adminDiscountKeys.list({ limit: 20, offset: 0 }),
  queryFn: async () => medusa.admin.discounts.list({ limit: 20, offset: 0 }),
})

export const discountsLoader = (client: QueryClient) => {
  return async () => {
    const query = discountsListQuery()

    return (
      queryClient.getQueryData<Response<AdminDiscountsListRes>>(
        query.queryKey
      ) ?? (await client.fetchQuery(query))
    )
  }
}
