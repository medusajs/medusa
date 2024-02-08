import { AdminGetProductsParams, AdminProductsListRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { adminProductKeys } from "medusa-react"
import { LoaderFunctionArgs } from "react-router-dom"

import { ProductStatus } from "@medusajs/types"
import { medusa, queryClient } from "../../../lib/medusa"

const productListQuery = (params: AdminGetProductsParams) => ({
  queryKey: adminProductKeys.list(params),
  queryFn: async () => medusa.admin.products.list(params),
})

export const productListLoader = async ({ request }: LoaderFunctionArgs) => {
  const params = new URL(request.url).searchParams

  const simpleKeys = ["order", "q"] as const
  const dateKeys = ["created_at", "updated_at"] as const
  const multiKeys = [
    "sales_channel_id",
    "category_id",
    "collection_id",
    "tags",
    "type_id",
  ] as const
  const booleanKeys = ["is_giftcard"] as const
  const enumKeys = ["status"] as const

  const populated: AdminGetProductsParams = {
    limit: 20,
    offset: params.get("offset") ? parseInt(params.get("offset") || "0") : 0,
  }

  simpleKeys.forEach((k) => {
    if (params.has(k)) {
      populated[k] = params.get(k) as string
    }
  })

  dateKeys.forEach((k) => {
    if (params.has(k)) {
      populated[k] = JSON.parse(params.get(k) || "")
    }
  })

  multiKeys.forEach((k) => {
    if (params.has(k)) {
      populated[k] = params.get(k)?.split(",")
    }
  })

  booleanKeys.forEach((k) => {
    if (params.has(k)) {
      populated[k] = params.get(k) === "true"
    }
  })

  enumKeys.forEach((k) => {
    if (params.has(k)) {
      populated[k] = params.get(k)?.split(",") as ProductStatus[]
    }
  })

  const query = productListQuery(populated)

  return (
    queryClient.getQueryData<Response<AdminProductsListRes>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
