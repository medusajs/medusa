import {
  AdminGetStockLocationsParams,
  AdminStockLocationsListRes,
  AdminStockLocationsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_STOCK_LOCATIONS_QUERY_KEY = `admin_stock_locations` as const

export const adminStockLocationsKeys = queryKeysFactory(
  ADMIN_STOCK_LOCATIONS_QUERY_KEY
)

type StockLocationsQueryKeys = typeof adminStockLocationsKeys

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
