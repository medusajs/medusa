import {
  AdminStockLocationsRes,
  AdminStockLocationsListRes,
  AdminGetStockLocationsParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_STOCK_LOCATIONS_QUERY_KEY = `admin_stock_locations` as const

export const adminStockLocationsKeys = queryKeysFactory(
  ADMIN_STOCK_LOCATIONS_QUERY_KEY
)

type StockLocationsQueryKeys = typeof adminStockLocationsKeys

/** retrieve a sales channel
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable feature flag `sales_channels` in your medusa backend project.
 * @description gets a sales channel
 * @returns a medusa sales channel
 */
export const useAdminStockLocation = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminStockLocationsRes>,
    Error,
    ReturnType<StockLocationsQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminStockLocationsKeys.detail(id),
    () => client.admin.stockLocations.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}

/**
 * retrieve a list of sales channels
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable feature flag `sales_channels` in your medusa backend project.
 * @description Retrieve a list of sales channel
 * @returns a list of sales channel as well as the pagination properties
 */
export const useAdminStockLocations = (
  query?: AdminGetStockLocationsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminStockLocationsListRes>,
    Error,
    ReturnType<StockLocationsQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminStockLocationsKeys.list(query),
    () => client.admin.stockLocations.list(query),
    options
  )
  return { ...data, ...rest } as const
}
