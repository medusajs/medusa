import { AdminUserRes, AdminUsersListRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_USERS_QUERY_KEY = `admin_users` as const

export const adminUserKeys = queryKeysFactory(ADMIN_USERS_QUERY_KEY)

type UserQueryKeys = typeof adminUserKeys

/**
 * This hook retrieves all admin users.
 * 
 * @example
 * import React from "react"
 * import { useAdminUsers } from "medusa-react"
 * 
 * const Users = () => {
 *   const { users, isLoading } = useAdminUsers()
 * 
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {users && !users.length && <span>No Users</span>}
 *       {users && users.length > 0 && (
 *         <ul>
 *           {users.map((user) => (
 *             <li key={user.id}>{user.email}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 * 
 * export default Users
 * 
 * @customNamespace Hooks.Admin.Users
 * @category Queries
 */
export const useAdminUsers = (
  options?: UseQueryOptionsWrapper<
    Response<AdminUsersListRes>,
    Error,
    ReturnType<UserQueryKeys["lists"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminUserKeys.lists(),
    () => client.admin.users.list(),
    options
  )
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves an admin user's details.
 * 
 * @example
 * import React from "react"
 * import { useAdminUser } from "medusa-react"
 * 
 * type Props = {
 *   userId: string
 * }
 * 
 * const User = ({ userId }: Props) => {
 *   const { user, isLoading } = useAdminUser(
 *     userId
 *   )
 * 
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {user && <span>{user.first_name} {user.last_name}</span>}
 *     </div>
 *   )
 * }
 * 
 * export default User
 * 
 * @customNamespace Hooks.Admin.Users
 * @category Queries
 */
export const useAdminUser = (
  /**
   * The user's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminUserRes>,
    Error,
    ReturnType<UserQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminUserKeys.detail(id),
    () => client.admin.users.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
