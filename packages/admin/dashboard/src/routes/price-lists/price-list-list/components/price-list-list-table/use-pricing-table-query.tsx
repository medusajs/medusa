import { HttpTypes, PriceListStatus } from "@medusajs/types"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const usePricingTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(["offset", "q", "order", "status"], prefix)

  const searchParams: HttpTypes.AdminPriceListListParams = {
    limit: pageSize,
    offset: raw.offset ? Number(raw.offset) : 0,
    order: raw.order,
    status: raw.status?.split(",") as PriceListStatus[],
    q: raw.q,
  }

  return {
    searchParams,
    raw,
  }
}
