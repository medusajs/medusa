import { AdminGetSalesChannelsParams } from "@medusajs/medusa"
import { useQueryParams } from "../../use-query-params"

type UseSalesChannelTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useSalesChannelTableQuery = ({
  prefix,
  pageSize = 20,
}: UseSalesChannelTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "q", "order", "created_at", "updated_at"],
    prefix
  )

  const { offset, created_at, updated_at, q, order } = queryObject

  const searchParams: AdminGetSalesChannelsParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    order,
    // created_at: created_at ? JSON.parse(created_at) : undefined,
    // updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    // q, // Re-enable when params are fixed
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
