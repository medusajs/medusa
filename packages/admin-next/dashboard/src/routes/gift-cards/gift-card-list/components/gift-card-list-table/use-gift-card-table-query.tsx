import { AdminGetGiftCardsParams } from "@medusajs/medusa"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useGiftCardTableQuery = ({ pageSize }: { pageSize: number }) => {
  const queryObject = useQueryParams(["offset", "q"])

  const { offset, q } = queryObject

  const searchParams: AdminGetGiftCardsParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
