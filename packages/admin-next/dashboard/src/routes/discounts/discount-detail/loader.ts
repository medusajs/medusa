import { AdminDiscountsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { adminDiscountKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { medusa, queryClient } from "../../../lib/medusa"

export const expand =
  "regions," +
  "rule.conditions.products," +
  "rule.conditions.product_types," +
  "rule.conditions.product_tags," +
  "rule.conditions.product_collections," +
  "rule.conditions.customer_groups"

const discountDetailQuery = (id: string) => ({
  queryKey: adminDiscountKeys.detail(id),
  queryFn: async () =>
    medusa.admin.discounts.retrieve(id, {
      expand,
    }),
})

export const discountLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = discountDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminDiscountsRes>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
