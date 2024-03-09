import { AdminGetTaxRatesParams } from "@medusajs/medusa"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useTaxRateTableQuery = ({
  pageSize = 10,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(
    ["offset", "q", "order", "created_at", "updated_at"],
    prefix
  )

  const searchParams: AdminGetTaxRatesParams = {
    limit: pageSize,
    offset: raw.offset ? parseInt(raw.offset) : 0,
    q: raw.q,
    order: raw.order,
    created_at: raw.created_at ? JSON.parse(raw.created_at) : undefined,
    updated_at: raw.updated_at ? JSON.parse(raw.updated_at) : undefined,
  }

  return {
    searchParams,
    raw,
  }
}
