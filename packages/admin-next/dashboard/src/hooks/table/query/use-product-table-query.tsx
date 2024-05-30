import { AdminGetProductsParams } from "@medusajs/medusa"
import { ProductStatus } from "@medusajs/types"

import { useQueryParams } from "../../use-query-params"

type UseProductTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useProductTableQuery = ({
  prefix,
  pageSize = 20,
}: UseProductTableQueryProps) => {
  const queryObject = useQueryParams(
    [
      "offset",
      "order",
      "q",
      "created_at",
      "updated_at",
      "sales_channel_id",
      "category_id",
      "collection_id",
      "is_giftcard",
      "tags",
      "type_id",
      "status",
      "id",
    ],
    prefix
  )

  const {
    offset,
    sales_channel_id,
    created_at,
    updated_at,
    category_id,
    collection_id,
    tags,
    type_id,
    is_giftcard,
    status,
    order,
    q,
  } = queryObject

  const searchParams: AdminGetProductsParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sales_channel_id: sales_channel_id?.split(","),
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    category_id: category_id?.split(","),
    collection_id: collection_id?.split(","),
    is_giftcard: is_giftcard ? is_giftcard === "true" : undefined,
    order: order,
    tags: tags?.split(","),
    type_id: type_id?.split(","),
    status: status?.split(",") as ProductStatus[],
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
