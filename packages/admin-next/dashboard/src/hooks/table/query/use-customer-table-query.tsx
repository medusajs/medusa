import { AdminGetCustomersParams } from "@medusajs/medusa"
import { useQueryParams } from "../../use-query-params"

type UseCustomerTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useCustomerTableQuery = ({
  prefix,
  pageSize = 20,
}: UseCustomerTableQueryProps) => {
  const queryObject = useQueryParams(
    [
      "offset",
      "q",
      "has_account",
      "groups",
      "order",
      "created_at",
      "updated_at",
    ],
    prefix
  )

  const { offset, groups, created_at, updated_at, has_account, q, order } =
    queryObject

  const searchParams: AdminGetCustomersParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    groups: groups?.split(","),
    has_account: has_account ? has_account === "true" : undefined,
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
