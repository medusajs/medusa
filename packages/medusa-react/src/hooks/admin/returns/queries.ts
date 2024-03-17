import { AdminReturnsListRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_RETURNS_QUERY_KEY = `admin_returns` as const

export const adminReturnKeys = queryKeysFactory(ADMIN_RETURNS_QUERY_KEY)

type ReturnQueryKeys = typeof adminReturnKeys

/**
 * This hook retrieves a list of Returns. The returns can be paginated.
 *
 * @example
 * import React from "react"
 * import { useAdminReturns } from "medusa-react"
 *
 * const Returns = () => {
 *   const { returns, isLoading } = useAdminReturns()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {returns && !returns.length && (
 *         <span>No Returns</span>
 *       )}
 *       {returns && returns.length > 0 && (
 *         <ul>
 *           {returns.map((returnData) => (
 *             <li key={returnData.id}>
 *               {returnData.status}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Returns
 *
 * @customNamespace Hooks.Admin.Returns
 * @category Queries
 */
export const useAdminReturns = (
  options?: UseQueryOptionsWrapper<
    Response<AdminReturnsListRes>,
    Error,
    ReturnType<ReturnQueryKeys["lists"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminReturnKeys.lists(),
    queryFn: () => client.admin.returns.list(),
    ...options,
  })
  return { ...data, ...rest } as const
}
