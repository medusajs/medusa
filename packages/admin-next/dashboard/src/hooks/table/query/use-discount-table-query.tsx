import { AdminGetDiscountsParams } from "@medusajs/medusa"

import { useQueryParams } from "../../use-query-params"

type UseDiscountTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useDiscountTableQuery = ({
  prefix,
  pageSize = 20,
}: UseDiscountTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "order", "q", "created_at", "updated_at"],
    prefix
  )

  const { offset, q } = queryObject

  const searchParams: AdminGetDiscountsParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
