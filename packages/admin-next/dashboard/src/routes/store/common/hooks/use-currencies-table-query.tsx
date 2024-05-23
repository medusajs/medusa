import { useQueryParams } from "../../../../hooks/use-query-params"

export const useCurrenciesTableQuery = ({
  pageSize = 10,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(["order", "q", "offset"], prefix)

  const { offset, ...rest } = raw

  const searchParams = {
    limit: pageSize,
    offset: offset ? parseInt(offset) : 0,
    ...rest,
  }

  return { searchParams, raw }
}
