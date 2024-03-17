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

/**
 * This hook retrieves a list of stock locations. The stock locations can be filtered by fields such as `name` or `created_at` passed in the `query` parameter.
 * The stock locations can also be sorted or paginated.
 *
 * @example
 * To list stock locations:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminStockLocations } from "medusa-react"
 *
 * function StockLocations() {
 *   const {
 *     stock_locations,
 *     isLoading
 *   } = useAdminStockLocations()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {stock_locations && !stock_locations.length && (
 *         <span>No Locations</span>
 *       )}
 *       {stock_locations && stock_locations.length > 0 && (
 *         <ul>
 *           {stock_locations.map(
 *             (location) => (
 *               <li key={location.id}>{location.name}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default StockLocations
 * ```
 *
 * To specify relations that should be retrieved within the stock locations:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminStockLocations } from "medusa-react"
 *
 * function StockLocations() {
 *   const {
 *     stock_locations,
 *     isLoading
 *   } = useAdminStockLocations({
 *     expand: "address"
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {stock_locations && !stock_locations.length && (
 *         <span>No Locations</span>
 *       )}
 *       {stock_locations && stock_locations.length > 0 && (
 *         <ul>
 *           {stock_locations.map(
 *             (location) => (
 *               <li key={location.id}>{location.name}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default StockLocations
 * ```
 *
 * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminStockLocations } from "medusa-react"
 *
 * function StockLocations() {
 *   const {
 *     stock_locations,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminStockLocations({
 *     expand: "address",
 *     limit: 10,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {stock_locations && !stock_locations.length && (
 *         <span>No Locations</span>
 *       )}
 *       {stock_locations && stock_locations.length > 0 && (
 *         <ul>
 *           {stock_locations.map(
 *             (location) => (
 *               <li key={location.id}>{location.name}</li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default StockLocations
 * ```
 *
 * @customNamespace Hooks.Admin.Stock Locations
 * @category Queries
 */
export const useAdminStockLocations = (
  /**
   * Filters and pagination configurations to apply on the retrieved stock locations.
   */
  query?: AdminGetStockLocationsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminStockLocationsListRes>,
    Error,
    ReturnType<StockLocationsQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery({
    queryKey: adminStockLocationsKeys.list(query),
    queryFn: () => client.admin.stockLocations.list(query),
    ...options,
  })

  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a stock location's details.
 *
 * @example
 * import React from "react"
 * import { useAdminStockLocation } from "medusa-react"
 *
 * type Props = {
 *   stockLocationId: string
 * }
 *
 * const StockLocation = ({ stockLocationId }: Props) => {
 *   const {
 *     stock_location,
 *     isLoading
 *   } = useAdminStockLocation(stockLocationId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {stock_location && (
 *         <span>{stock_location.name}</span>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default StockLocation
 *
 * @customNamespace Hooks.Admin.Stock Locations
 * @category Queries
 */
export const useAdminStockLocation = (
  /**
   * The stock location's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminStockLocationsRes>,
    Error,
    ReturnType<StockLocationsQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery({
    queryKey: adminStockLocationsKeys.detail(id),
    queryFn: () => client.admin.stockLocations.retrieve(id),
    ...options,
  })

  return { ...data, ...rest } as const
}
