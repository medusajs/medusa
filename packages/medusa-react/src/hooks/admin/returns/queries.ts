import { AdminReturnsListRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_RETURNS_QUERY_KEY = `admin_returns` as const

export const adminReturnKeys = queryKeysFactory(ADMIN_RETURNS_QUERY_KEY)

type ReturnQueryKeys = typeof adminReturnKeys

export const useAdminReturns = (
  options?: UseQueryOptionsWrapper<
    Response<AdminReturnsListRes>,
    Error,
    ReturnType<ReturnQueryKeys["lists"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminReturnKeys.lists(),
    () => client.admin.returns.list(),
    options
  )
  return { ...data, ...rest } as const
}
