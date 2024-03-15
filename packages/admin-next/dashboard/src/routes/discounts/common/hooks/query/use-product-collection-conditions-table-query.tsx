import { AdminGetCollectionsParams } from "@medusajs/medusa"

import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useProductCollectionConditionsTableQuery = ({
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
      "title",
      "handle",
      "discount_condition_id",
      "created_at",
      "updated_at",
    ],
    prefix
  )

  const searchParams: AdminGetCollectionsParams = {
    limit: pageSize,
    offset: raw.offset ? Number(raw.offset) : 0,
    q: raw.q,
    title: raw.title,
    handle: raw.handle,
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
