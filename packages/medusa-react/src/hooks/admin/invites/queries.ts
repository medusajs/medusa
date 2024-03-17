import { AdminListInvitesRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_INVITES_QUERY_KEY = `admin_invites` as const

export const adminInviteKeys = queryKeysFactory(ADMIN_INVITES_QUERY_KEY)

type InviteQueryKeys = typeof adminInviteKeys

/**
 * This hook retrieves a list of invites.
 *
 * @example
 * import React from "react"
 * import { useAdminInvites } from "medusa-react"
 *
 * const Invites = () => {
 *   const { invites, isLoading } = useAdminInvites()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {invites && !invites.length && (
 *         <span>No Invites</span>)
 *       }
 *       {invites && invites.length > 0 && (
 *         <ul>
 *           {invites.map((invite) => (
 *             <li key={invite.id}>{invite.user_email}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Invites
 *
 * @customNamespace Hooks.Admin.Invites
 * @category Queries
 */
export const useAdminInvites = (
  options?: UseQueryOptionsWrapper<
    Response<AdminListInvitesRes>,
    Error,
    ReturnType<InviteQueryKeys["lists"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminInviteKeys.lists(),
    queryFn: () => client.admin.invites.list(),
    ...options,
  })
  return { ...data, ...rest } as const
}
