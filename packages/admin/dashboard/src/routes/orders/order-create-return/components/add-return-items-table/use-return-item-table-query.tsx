import {
  DateComparisonOperator,
  NumericalComparisonOperator,
} from "@medusajs/types"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export type ReturnItemTableQuery = {
  q?: string
  offset: number
  order?: string
  created_at?: DateComparisonOperator
  updated_at?: DateComparisonOperator
  returnable_quantity?: NumericalComparisonOperator | number
  refundable_amount?: NumericalComparisonOperator | number
}

export const useReturnItemTableQuery = ({
  pageSize = 50,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(
    [
      "q",
      "offset",
      "order",
      "created_at",
      "updated_at",
      "returnable_quantity",
      "refundable_amount",
    ],
    prefix
  )

  const {
    offset,
    created_at,
    updated_at,
    refundable_amount,
    returnable_quantity,
    ...rest
  } = raw

  const searchParams = {
    ...rest,
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    refundable_amount: refundable_amount
      ? JSON.parse(refundable_amount)
      : undefined,
    returnable_quantity: returnable_quantity
      ? JSON.parse(returnable_quantity)
      : undefined,
  }

  return { searchParams, raw }
}
