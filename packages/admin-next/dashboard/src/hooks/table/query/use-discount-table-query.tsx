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
    ["offset", "order", "q", "is_dynamic", "is_disabled"],
    prefix
  )

  const { offset, order, q, is_dynamic, is_disabled } = queryObject

  console.log(order)
  const searchParams: AdminGetDiscountsParams = {
    limit: pageSize,
    is_disabled: is_disabled ? is_disabled === "true" : undefined,
    is_dynamic: is_dynamic ? is_dynamic === "true" : undefined,
    offset: offset ? Number(offset) : 0,
    order,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
