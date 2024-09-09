import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useCategoryTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(["q", "offset", "order"], prefix)

  const searchParams = {
    q: raw.q,
    limit: pageSize,
    offset: raw.offset ? Number(raw.offset) : 0,
    order: raw.order,
  }

  return {
    raw,
    searchParams,
  }
}
