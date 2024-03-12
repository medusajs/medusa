import { AdminGetPriceListPaginationParams } from "@medusajs/medusa"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const usePricingTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(["offset", "q"], prefix)

  const searchParams: AdminGetPriceListPaginationParams = {
    limit: pageSize,
    offset: raw.offset ? Number(raw.offset) : 0,
    q: raw.q,
  }

  return {
    searchParams,
    raw,
  }
}
