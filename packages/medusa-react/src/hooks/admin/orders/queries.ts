import {
  AdminOrdersListRes,
  AdminOrdersRes,
  AdminGetOrdersParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_ORDERS_QUERY_KEY = `admin_orders` as const

export const adminOrderKeys = queryKeysFactory(ADMIN_ORDERS_QUERY_KEY)

type OrderQueryKeys = typeof adminOrderKeys

export const useAdminOrders = (
  query?: AdminGetOrdersParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminOrdersListRes>,
    Error,
    ReturnType<OrderQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminOrderKeys.list(query),
    () => client.admin.orders.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminOrder = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminOrdersRes>,
    Error,
    ReturnType<OrderQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminOrderKeys.detail(id),
    () => client.admin.orders.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
