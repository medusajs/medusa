import { HttpTypes } from "@medusajs/types"
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
    ["offset", "q", "order", "created_at", "updated_at", "is_disabled"],
    prefix
  )

  const { offset, created_at, updated_at, is_disabled, ...rest } = queryObject

  const searchParams: HttpTypes.AdminSalesChannelListParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    is_disabled:
      is_disabled === "true"
        ? true
        : is_disabled === "false"
        ? false
        : undefined,
    ...rest,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
