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

export const useClaimOutboundItemTableQuery = ({
  pageSize = 50,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(
    ["q", "offset", "order", "created_at", "updated_at"],
    prefix
  )

  const { offset, created_at, updated_at, ...rest } = raw

  const searchParams = {
    ...rest,
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
  }

  return { searchParams, raw }
}
