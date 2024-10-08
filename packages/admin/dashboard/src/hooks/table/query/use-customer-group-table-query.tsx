import { HttpTypes } from "@medusajs/types"
import { useQueryParams } from "../../use-query-params"

type UseCustomerGroupTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useCustomerGroupTableQuery = ({
  prefix,
  pageSize = 20,
}: UseCustomerGroupTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "q", "has_account", "order", "created_at", "updated_at"],
    prefix
  )

  const { offset, created_at, updated_at, q, order } = queryObject

  const searchParams: HttpTypes.AdminGetCustomerGroupsParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    order,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
