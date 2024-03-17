import {
  AdminGetSwapsParams,
  AdminSwapsListRes,
  AdminSwapsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_SWAPS_QUERY_KEY = `admin_swaps` as const

export const adminSwapKeys = queryKeysFactory(ADMIN_SWAPS_QUERY_KEY)

type SwapsQueryKey = typeof adminSwapKeys

/**
 * This hook retrieves a list of swaps. The swaps can be paginated.
 *
 * @example
 * To list swaps:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminSwaps } from "medusa-react"
 *
 * const Swaps = () => {
 *   const { swaps, isLoading } = useAdminSwaps()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {swaps && !swaps.length && <span>No Swaps</span>}
 *       {swaps && swaps.length > 0 && (
 *         <ul>
 *           {swaps.map((swap) => (
 *             <li key={swap.id}>{swap.payment_status}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Swaps
 * ```
 *
 * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminSwaps } from "medusa-react"
 *
 * const Swaps = () => {
 *   const {
 *     swaps,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminSwaps({
 *     limit: 10,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {swaps && !swaps.length && <span>No Swaps</span>}
 *       {swaps && swaps.length > 0 && (
 *         <ul>
 *           {swaps.map((swap) => (
 *             <li key={swap.id}>{swap.payment_status}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Swaps
 * ```
 *
 * @customNamespace Hooks.Admin.Swaps
 * @category Queries
 */
export const useAdminSwaps = (
  /**
   * Pagination configurations to apply on the retrieved swaps.
   */
  query?: AdminGetSwapsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminSwapsListRes>,
    Error,
    ReturnType<SwapsQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminSwapKeys.list(query),
    queryFn: () => client.admin.swaps.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a swap's details.
 *
 * @example
 * import React from "react"
 * import { useAdminSwap } from "medusa-react"
 *
 * type Props = {
 *   swapId: string
 * }
 *
 * const Swap = ({ swapId }: Props) => {
 *   const { swap, isLoading } = useAdminSwap(swapId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {swap && <span>{swap.id}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Swap
 *
 * @customNamespace Hooks.Admin.Swaps
 * @category Queries
 */
export const useAdminSwap = (
  /**
   * The swap's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminSwapsRes>,
    Error,
    ReturnType<SwapsQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminSwapKeys.detail(id),
    queryFn: () => client.admin.swaps.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
