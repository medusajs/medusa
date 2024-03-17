import { StoreRegionsListRes, StoreRegionsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const REGIONS_QUERY_KEY = `regions` as const

const regionsKey = queryKeysFactory(REGIONS_QUERY_KEY)

type RegionQueryType = typeof regionsKey

/**
 * This hook retrieves a list of regions. This hook is useful to show the customer all available regions to choose from.
 *
 * @example
 * import React from "react"
 * import { useRegions } from "medusa-react"
 *
 * const Regions = () => {
 *   const { regions, isLoading } = useRegions()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {regions?.length && (
 *         <ul>
 *           {regions.map((region) => (
 *             <li key={region.id}>
 *               {region.name}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Regions
 *
 * @customNamespace Hooks.Store.Regions
 * @category Queries
 */
export const useRegions = (
  options?: UseQueryOptionsWrapper<
    Response<StoreRegionsListRes>,
    Error,
    ReturnType<RegionQueryType["lists"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: regionsKey.lists(),
    queryFn: () => client.regions.list(),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a Region's details.
 *
 * @example
 * import React from "react"
 * import { useRegion } from "medusa-react"
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const Region = ({ regionId }: Props) => {
 *   const { region, isLoading } = useRegion(
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
 * @customNamespace Hooks.Store.Regions
 * @category Queries
 */
export const useRegion = (
  /**
   * The region's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreRegionsRes>,
    Error,
    ReturnType<RegionQueryType["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: regionsKey.detail(id),
    queryFn: () => client.regions.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
