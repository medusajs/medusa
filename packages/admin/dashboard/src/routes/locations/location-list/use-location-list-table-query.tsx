import { HttpTypes } from "@zjedene-medusa/types"
import { useQueryParams } from "../../../hooks/use-query-params"

export const useLocationListTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const queryObject = useQueryParams(["order", "offset", "q"], prefix)

  const { offset, ...rest } = queryObject

  const searchParams: HttpTypes.AdminStockLocationListParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    ...rest,
  }

  return searchParams
}
