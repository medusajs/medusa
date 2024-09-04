import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useOrderEditItemTableQuery = ({
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
