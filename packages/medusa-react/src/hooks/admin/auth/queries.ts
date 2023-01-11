import { AdminAuthRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_AUTH_QUERY_KEY = `admin_auth` as const

export const adminAuthKeys = queryKeysFactory(ADMIN_AUTH_QUERY_KEY)

type AuthQueryKey = typeof adminAuthKeys

export const useAdminGetSession = (
  options?: UseQueryOptionsWrapper<
    Response<AdminAuthRes>,
    Error,
    ReturnType<AuthQueryKey["details"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminAuthKeys.details(),
    () => client.admin.auth.getSession(),
    options
  )
  return { ...data, ...rest } as const
}
