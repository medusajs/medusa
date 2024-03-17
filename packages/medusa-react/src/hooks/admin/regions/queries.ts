import {
  AdminGetRegionsParams,
  AdminGetRegionsRegionFulfillmentOptionsRes,
  AdminRegionsListRes,
  AdminRegionsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_REGIONS_QUERY_KEY = `admin_regions` as const

export const adminRegionKeys = queryKeysFactory(ADMIN_REGIONS_QUERY_KEY)

type RegionQueryKeys = typeof adminRegionKeys

/**
 * This hook retrieves a list of Regions. The regions can be filtered by fields such as `created_at` passed in the `query` parameter.
 * The regions can also be paginated.
 *
 * @example
 * To list regions:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminRegions } from "medusa-react"
 *
 * const Regions = () => {
 *   const { regions, isLoading } = useAdminRegions()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {regions && !regions.length && <span>No Regions</span>}
 *       {regions && regions.length > 0 && (
 *         <ul>
 *           {regions.map((region) => (
 *             <li key={region.id}>{region.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Regions
 * ```
 *
 * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminRegions } from "medusa-react"
 *
 * const Regions = () => {
 *   const {
 *     regions,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminRegions({
 *     limit: 20,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {regions && !regions.length && <span>No Regions</span>}
 *       {regions && regions.length > 0 && (
 *         <ul>
 *           {regions.map((region) => (
 *             <li key={region.id}>{region.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Regions
 * ```
 *
 * @customNamespace Hooks.Admin.Regions
 * @category Queries
 */
export const useAdminRegions = (
  /**
   * Filters and pagination configurations to apply on the retrieved regions.
   */
  query?: AdminGetRegionsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminRegionsListRes>,
    Error,
    ReturnType<RegionQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminRegionKeys.list(query),
    queryFn: () => client.admin.regions.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a region's details.
 *
 * @example
 * import React from "react"
 * import { useAdminRegion } from "medusa-react"
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const Region = ({
 *   regionId
 * }: Props) => {
 *   const { region, isLoading } = useAdminRegion(
 *     regionId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {region && <span>{region.name}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Region
 *
 * @customNamespace Hooks.Admin.Regions
 * @category Queries
 */
export const useAdminRegion = (
  /**
   * The region's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminRegionsRes>,
    Error,
    ReturnType<RegionQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminRegionKeys.detail(id),
    queryFn: () => client.admin.regions.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a list of fulfillment options available in a region.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminRegionFulfillmentOptions
 * } from "medusa-react"
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const Region = ({
 *   regionId
 * }: Props) => {
 *   const {
 *     fulfillment_options,
 *     isLoading
 *   } = useAdminRegionFulfillmentOptions(
 *     regionId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {fulfillment_options && !fulfillment_options.length && (
 *         <span>No Regions</span>
 *       )}
 *       {fulfillment_options &&
 *         fulfillment_options.length > 0 && (
 *         <ul>
 *           {fulfillment_options.map((option) => (
 *             <li key={option.provider_id}>
 *               {option.provider_id}
 *             </li>
 *           ))}
 *         </ul>
 *           )}
 *     </div>
 *   )
 * }
 *
 * export default Region
 *
 * @customNamespace Hooks.Admin.Regions
 * @category Queries
 */
export const useAdminRegionFulfillmentOptions = (
  /**
   * The region's ID.
   */
  regionId: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminGetRegionsRegionFulfillmentOptionsRes>,
    Error,
    ReturnType<RegionQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminRegionKeys.detail(`${regionId}_fullfillment-options`),
    queryFn: () => client.admin.regions.retrieveFulfillmentOptions(regionId),
    ...options,
  })
  return { ...data, ...rest } as const
}
