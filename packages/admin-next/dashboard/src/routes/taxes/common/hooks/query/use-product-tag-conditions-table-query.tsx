import { AdminGetProductTagsParams } from "@medusajs/medusa"

import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useProductTagConditionsTableQuery = ({
  pageSize = 50,
  prefix,
}: {
  pageSize?: number
  prefix: string
}) => {
  const raw = useQueryParams(
    [
      "offset",
      "q",
      "order",
      "value",
      "discount_condition_id",
      "created_at",
      "updated_at",
    ],
    prefix
  )

  const searchParams: AdminGetProductTagsParams = {
    limit: pageSize,
    offset: raw.offset ? Number(raw.offset) : 0,
    q: raw.q,
    discount_condition_id: raw.discount_condition_id,
    created_at: raw.created_at ? JSON.parse(raw.created_at) : undefined,
    updated_at: raw.updated_at ? JSON.parse(raw.updated_at) : undefined,
    order: raw.order,
  }

  return {
    searchParams,
    raw,
  }
}
