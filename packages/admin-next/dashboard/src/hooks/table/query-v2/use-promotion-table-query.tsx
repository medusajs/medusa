import { AdminGetPromotionsParams } from "@medusajs/medusa"
import { useQueryParams } from "../../use-query-params"

type UsePromotionTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const usePromotionTableQuery = ({
  prefix,
  pageSize = 20,
}: UsePromotionTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "q", "created_at", "updated_at"],
    prefix
  )

  const { offset, q, created_at, updated_at } = queryObject

  const searchParams: AdminGetPromotionsParams = {
    limit: pageSize,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    offset: offset ? Number(offset) : 0,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
