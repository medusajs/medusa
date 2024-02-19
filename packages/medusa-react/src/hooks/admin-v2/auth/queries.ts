import { AdminAuthRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_AUTH_QUERY_KEY = `admin_auth` as const

export const adminV2AuthKeys = queryKeysFactory(ADMIN_AUTH_QUERY_KEY)

type AuthQueryKey = typeof adminV2AuthKeys

export const useAdminV2GetSession = (
  options?: UseQueryOptionsWrapper<
    Response<AdminAuthRes>,
    Error,
    ReturnType<AuthQueryKey["details"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminV2AuthKeys.details(),
    () => client.admin.auth.getSession(),
    options
  )
  return { ...data, ...rest } as const
}
