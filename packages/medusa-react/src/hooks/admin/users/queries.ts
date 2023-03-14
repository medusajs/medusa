import { AdminUserRes, AdminUsersListRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_USERS_QUERY_KEY = `admin_users` as const

export const adminUserKeys = queryKeysFactory(ADMIN_USERS_QUERY_KEY)

type UserQueryKeys = typeof adminUserKeys

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

export const useAdminUser = (
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
