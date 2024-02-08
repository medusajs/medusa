import { AdminGetSalesChannelsParams } from "@medusajs/medusa"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useSalesChannelTableQuery = ({
  pageSize,
}: {
  pageSize: number
}) => {
  const queryObject = useQueryParams([
    "offset",
    "q",
    "created_at",
    "updated_at",
    "order",
  ])

  const { offset, q, order, created_at, updated_at } = queryObject

  const searchParams: AdminGetSalesChannelsParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    q,
    order,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
