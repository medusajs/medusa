import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useUserTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(["q", "order", "offset"], prefix)

  const { offset, ...params } = raw

  const searchParams = {
    limit: pageSize,
    offset: offset ? parseInt(offset) : 0,
    ...params,
  }

  return {
    searchParams,
    raw,
  }
}
