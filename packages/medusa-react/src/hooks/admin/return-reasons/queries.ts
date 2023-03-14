import {
  AdminReturnReasonsListRes,
  AdminReturnReasonsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_RETURNS_REASONS_QUERY_KEY = `admin_return_reasons` as const

export const adminReturnReasonKeys = queryKeysFactory(
  ADMIN_RETURNS_REASONS_QUERY_KEY
)

type ReturnReasonQueryKeys = typeof adminReturnReasonKeys

export const useAdminReturnReasons = (
  options?: UseQueryOptionsWrapper<
    Response<AdminReturnReasonsListRes>,
    Error,
    ReturnType<ReturnReasonQueryKeys["lists"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminReturnReasonKeys.lists(),
    () => client.admin.returnReasons.list(),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminReturnReason = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminReturnReasonsRes>,
    Error,
    ReturnType<ReturnReasonQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminReturnReasonKeys.detail(id),
    () => client.admin.returnReasons.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
