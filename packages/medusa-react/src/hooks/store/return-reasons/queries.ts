import {
  StoreReturnReasonsListRes,
  StoreReturnReasonsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const RETURNS_REASONS_QUERY_KEY = `return_reasons` as const

const returnReasonsKey = queryKeysFactory(RETURNS_REASONS_QUERY_KEY)

type ReturnReasonsQueryKey = typeof returnReasonsKey

/**
 * This hook retrieves a list of Return Reasons. This is useful when implementing a Create Return flow in the storefront.
 *
 * @example
 * import React from "react"
 * import { useReturnReasons } from "medusa-react"
 *
 * const ReturnReasons = () => {
 *   const {
 *     return_reasons,
 *     isLoading
 *   } = useReturnReasons()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {return_reasons?.length && (
 *         <ul>
 *           {return_reasons.map((returnReason) => (
 *             <li key={returnReason.id}>
 *               {returnReason.label}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default ReturnReasons
 *
 * @customNamespace Hooks.Store.Return Reasons
 * @category Queries
 */
export const useReturnReasons = (
  options?: UseQueryOptionsWrapper<
    Response<StoreReturnReasonsListRes>,
    Error,
    ReturnType<ReturnReasonsQueryKey["lists"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: returnReasonsKey.lists(),
    queryFn: () => client.returnReasons.list(),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a Return Reason's details.
 *
 * @example
 * import React from "react"
 * import { useReturnReason } from "medusa-react"
 *
 * type Props = {
 *   returnReasonId: string
 * }
 *
 * const ReturnReason = ({ returnReasonId }: Props) => {
 *   const {
 *     return_reason,
 *     isLoading
 *   } = useReturnReason(
 *     returnReasonId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {return_reason && <span>{return_reason.label}</span>}
 *     </div>
 *   )
 * }
 *
 * export default ReturnReason
 *
 * @customNamespace Hooks.Store.Return Reasons
 * @category Queries
 */
export const useReturnReason = (
  /**
   * The return reason's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreReturnReasonsRes>,
    Error,
    ReturnType<ReturnReasonsQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: returnReasonsKey.detail(id),
    queryFn: () => client.returnReasons.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
