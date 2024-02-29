import { AdminGetInventoryItemsParams } from "@medusajs/medusa"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useInventoryTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(["location_id", "q", "offset", "material"], prefix)

  const { offset, ...params } = raw

  const searchParams: AdminGetInventoryItemsParams = {
    limit: pageSize,
    offset: offset ? parseInt(offset) : undefined,
    ...params,
  }

  return {
    searchParams,
    raw,
  }
}
