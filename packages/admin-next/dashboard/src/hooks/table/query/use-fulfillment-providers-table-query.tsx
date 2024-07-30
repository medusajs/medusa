import { HttpTypes } from "@medusajs/types"
import { useQueryParams } from "../../use-query-params"

type UseFulfillmentProviderTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useFulfillmentProvidersTableQuery = ({
  prefix,
  pageSize = 20,
}: UseFulfillmentProviderTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "q", "stock_location_id"],
    prefix
  )

  const { offset, q, stock_location_id } = queryObject

  const searchParams: HttpTypes.AdminFulfillmentProviderListParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    stock_location_id,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
