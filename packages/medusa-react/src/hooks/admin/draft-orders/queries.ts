import {
  AdminDraftOrdersListRes,
  AdminDraftOrdersRes,
  AdminGetDraftOrdersParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_DRAFT_ORDERS_QUERY_KEY = `admin_draft_orders` as const

export const adminDraftOrderKeys = queryKeysFactory(
  ADMIN_DRAFT_ORDERS_QUERY_KEY
)

type DraftOrderQueryKeys = typeof adminDraftOrderKeys

export const useAdminDraftOrders = (
  query?: AdminGetDraftOrdersParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminDraftOrdersListRes>,
    Error,
    ReturnType<DraftOrderQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminDraftOrderKeys.list(query),
    () => client.admin.draftOrders.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminDraftOrder = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminDraftOrdersRes>,
    Error,
    ReturnType<DraftOrderQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminDraftOrderKeys.detail(id),
    () => client.admin.draftOrders.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
