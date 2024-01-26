import {
  AdminGetUsersParams,
  AdminUserRes,
  AdminUsersListRes,
} from "@medusajs/medusa"
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
 * To list users:
 *
 * ```tsx
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
 * ```
 *
 * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminUsers } from "medusa-react"
 *
 * const Users = () => {
 *   const {
 *     users,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminUsers({
 *     limit: 20,
 *     offset: 0
 *   })
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
 * ```
 *
 * @customNamespace Hooks.Admin.Users
 * @category Queries
 */
export const useAdminUsers = (
  query?: AdminGetUsersParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminUsersListRes>,
    Error,
    ReturnType<UserQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminUserKeys.list(query),
    () => client.admin.users.list(query),
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
