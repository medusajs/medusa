import { AdminGetProductTypesParams } from "@medusajs/medusa"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useProductTypeConditionsTableQuery = ({
  pageSize = 50,
  prefix,
}: {
  pageSize?: number
  prefix: string
}) => {
  const raw = useQueryParams(
    ["offset", "q", "order", "created_at", "updated_at"],
    prefix
  )

  const searchParams: AdminGetProductTypesParams = {
    limit: pageSize,
    offset: raw.offset ? Number(raw.offset) : 0,
    q: raw.q,
    created_at: raw.created_at ? JSON.parse(raw.created_at) : undefined,
    updated_at: raw.updated_at ? JSON.parse(raw.updated_at) : undefined,
    order: raw.order,
  }

  return {
    searchParams,
    raw,
  }
}
