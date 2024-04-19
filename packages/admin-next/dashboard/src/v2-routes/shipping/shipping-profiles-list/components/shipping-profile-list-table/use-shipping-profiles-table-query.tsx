import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useShippingProfilesTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(["offset"], prefix)

  const searchParams = {
    limit: pageSize,
    offset: raw.offset,
  }

  return {
    searchParams,
    raw,
  }
}
