import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useLocationTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(["q", "offset"], prefix)

  const searchParams = {
    limit: pageSize,
    offset: raw.offset,
    q: raw.q,
  }

  return {
    searchParams,
    raw,
  }
}
