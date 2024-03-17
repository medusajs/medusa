import { AdminAuthRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_AUTH_QUERY_KEY = `admin_auth` as const

export const adminAuthKeys = queryKeysFactory(ADMIN_AUTH_QUERY_KEY)

type AuthQueryKey = typeof adminAuthKeys

/**
 * This hook is used to get the currently logged in user's details. Can also be used to check if there is an authenticated user.
 *
 * This hook requires {@link Hooks~Admin~Auth~useAdminLogin | user authentication}.
 *
 * @example
 * import React from "react"
 * import { useAdminGetSession } from "medusa-react"
 *
 * const Profile = () => {
 *   const { user, isLoading } = useAdminGetSession()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {user && <span>{user.email}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Profile
 *
 * @customNamespace Hooks.Admin.Auth
 * @category Queries
 */
export const useAdminGetSession = (
  options?: UseQueryOptionsWrapper<
    Response<AdminAuthRes>,
    Error,
    ReturnType<AuthQueryKey["details"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminAuthKeys.details(),
    queryFn: () => client.admin.auth.getSession(),
    ...options,
  })
  return { ...data, ...rest } as const
}
